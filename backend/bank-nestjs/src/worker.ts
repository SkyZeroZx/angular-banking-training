import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from './accounts/accounts.service';
import { AccountRequestDto } from './accounts/dto/account.dto';
import { AuthService } from './auth/auth.service';
import { AuthRequestDto } from './auth/dto/auth-request.dto';
import { ClientsService } from './clients/clients.service';
import { ClientRequestDto } from './clients/dto/client.dto';
import { DEFAULT_JWT_EXPIRATION_MS } from './common/constants';
import {
  DomainHttpError,
  GatewayUnauthorizedError,
  RequestValidationError,
  badRequest,
} from './common/domain-error';
import { PageQuery } from './common/pagination';
import { InMemoryStore } from './database/in-memory.store';
import { ReportsService } from './reports/reports.service';
import { TransactionRequestDto } from './transactions/dto/transaction.dto';
import { TransactionsService } from './transactions/transactions.service';

interface WorkerApp {
  jwtService: JwtService;
  authService: AuthService;
  clientsService: ClientsService;
  accountsService: AccountsService;
  transactionsService: TransactionsService;
  reportsService: ReportsService;
}

let app: WorkerApp | undefined;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    applyEnv(env);

    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }), request);
    }

    const url = new URL(request.url);

    try {
      const currentApp = getApp(env);
      authorize(request, url.pathname, currentApp.jwtService);
      return withCors(await route(request, url, currentApp), request);
    } catch (error) {
      return withCors(errorResponse(error, url.pathname), request);
    }
  },
} satisfies ExportedHandler<Env>;

function getApp(env: Env): WorkerApp {
  if (app) {
    return app;
  }

  const store = new InMemoryStore();
  store.onModuleInit();

  const expirationMs = Number(env.JWT_EXPIRATION_MS ?? DEFAULT_JWT_EXPIRATION_MS);
  const jwtService = new JwtService({
    secret: env.JWT_SECRET,
    signOptions: { expiresIn: Math.floor(expirationMs / 1000) },
  });
  const clientsService = new ClientsService(store);
  const accountsService = new AccountsService(store, clientsService);
  const transactionsService = new TransactionsService(store, accountsService);

  app = {
    jwtService,
    authService: new AuthService(store, jwtService),
    clientsService,
    accountsService,
    transactionsService,
    reportsService: new ReportsService(store),
  };

  return app;
}

async function route(request: Request, url: URL, currentApp: WorkerApp): Promise<Response> {
  const segments = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const method = request.method;
  const query = toQuery(url);

  if (method === 'GET' && url.pathname === '/actuator/health') {
    return json({ status: 'UP' });
  }

  if (segments[0] === 'auth') {
    if (method === 'POST' && segments[1] === 'login' && segments.length === 2) {
      return json(
        currentApp.authService.login(await validateJson(request, AuthRequestDto)),
        200,
        featureHeaders(),
      );
    }
    if (method === 'POST' && segments[1] === 'register' && segments.length === 2) {
      return json(currentApp.authService.register(await validateJson(request, AuthRequestDto)), 201);
    }
    if (method === 'GET' && segments[1] === 'validate' && segments.length === 2) {
      return json(currentApp.authService.validateToken(url.searchParams.get('token') ?? undefined));
    }
  }

  if (segments[0] === 'api' && segments[1] === 'clientes') {
    const clienteId = segments[2];
    if (method === 'GET' && segments.length === 2) {
      return json(currentApp.clientsService.findAll(query));
    }
    if (method === 'GET' && clienteId && segments.length === 3) {
      return json(currentApp.clientsService.findByClienteId(clienteId));
    }
    if (method === 'POST' && segments.length === 2) {
      return json(currentApp.clientsService.create(await validateJson(request, ClientRequestDto)), 201);
    }
    if (method === 'PUT' && clienteId && segments.length === 3) {
      return json(currentApp.clientsService.update(clienteId, await validateJson(request, ClientRequestDto)));
    }
    if (method === 'PATCH' && clienteId && segments.length === 3) {
      return json(currentApp.clientsService.partialUpdate(clienteId, await readJson(request)));
    }
    if (method === 'DELETE' && clienteId && segments.length === 3) {
      currentApp.clientsService.delete(clienteId);
      return new Response(null, { status: 204 });
    }
  }

  if (segments[0] === 'api' && segments[1] === 'cuentas') {
    const numeroCuenta = segments[2];
    if (method === 'GET' && segments.length === 2) {
      return json(currentApp.accountsService.findAll(query));
    }
    if (method === 'GET' && numeroCuenta && segments.length === 3) {
      return json(currentApp.accountsService.findByAccountNumber(numeroCuenta));
    }
    if (method === 'POST' && segments.length === 2) {
      return json(currentApp.accountsService.create(await validateJson(request, AccountRequestDto)), 201);
    }
    if (method === 'PUT' && numeroCuenta && segments.length === 3) {
      return json(currentApp.accountsService.update(numeroCuenta, await validateJson(request, AccountRequestDto)));
    }
    if (method === 'PATCH' && numeroCuenta && segments.length === 3) {
      return json(currentApp.accountsService.partialUpdate(numeroCuenta, await readJson(request)));
    }
    if (method === 'DELETE' && numeroCuenta && segments.length === 3) {
      currentApp.accountsService.delete(numeroCuenta);
      return new Response(null, { status: 204 });
    }
  }

  if (segments[0] === 'api' && segments[1] === 'movimientos') {
    const id = segments[2] ? parseId(segments[2]) : undefined;
    if (method === 'GET' && segments.length === 2) {
      return json(currentApp.transactionsService.findAll(query));
    }
    if (method === 'GET' && id !== undefined && segments.length === 3) {
      return json(currentApp.transactionsService.findById(id));
    }
    if (method === 'POST' && segments.length === 2) {
      return json(currentApp.transactionsService.register(await validateJson(request, TransactionRequestDto)), 201);
    }
    if (method === 'DELETE' && id !== undefined && segments.length === 3) {
      currentApp.transactionsService.delete(id);
      return new Response(null, { status: 204 });
    }
  }

  if (segments[0] === 'api' && segments[1] === 'reportes') {
    const cliente = url.searchParams.get('cliente') ?? undefined;
    const fechaInicio = url.searchParams.get('fechaInicio') ?? undefined;
    const fechaFin = url.searchParams.get('fechaFin') ?? undefined;

    if (method === 'GET' && segments[2] === 'pdf' && segments.length === 3) {
      return json(currentApp.reportsService.generatePdfReportBase64(cliente, fechaInicio, fechaFin));
    }
    if (method === 'GET' && segments.length === 2) {
      return json(currentApp.reportsService.generateJsonReport(cliente, fechaInicio, fechaFin, query));
    }
  }

  return json(
    {
      timestamp: new Date().toISOString(),
      status: 404,
      error: 'Not Found',
      message: `Cannot ${method} ${url.pathname}`,
      path: url.pathname,
    },
    404,
  );
}

function authorize(request: Request, path: string, jwtService: JwtService): void {
  if (request.method === 'OPTIONS' || path.startsWith('/auth/') || path.startsWith('/actuator/')) {
    return;
  }

  if (!path.startsWith('/api/')) {
    return;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new GatewayUnauthorizedError('Missing or invalid Authorization header');
  }

  try {
    jwtService.verify<{ sub: string; role: string }>(authHeader.slice('Bearer '.length));
  } catch {
    throw new GatewayUnauthorizedError('Invalid or expired token');
  }
}

async function validateJson<T extends object>(
  request: Request,
  Dto: new () => T,
): Promise<T> {
  const instance = plainToInstance(Dto, await readJson(request), {
    enableImplicitConversion: true,
  });
  const errors = validateSync(instance, {
    forbidUnknownValues: false,
    whitelist: false,
  });

  if (errors.length > 0) {
    throw new RequestValidationError(toValidationErrors(errors));
  }

  return instance;
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body)
      ? body as Record<string, unknown>
      : {};
  } catch {
    throw badRequest('Invalid JSON body');
  }
}

function parseId(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw badRequest('Validation failed (numeric string is expected)');
  }
  return parsed;
}

function toQuery(url: URL): PageQuery {
  return {
    page: url.searchParams.get('page') ?? undefined,
    size: url.searchParams.get('size') ?? undefined,
    sort: url.searchParams.get('sort') ?? undefined,
    search: url.searchParams.get('search') ?? undefined,
  };
}

function json(body: unknown, status = 200, headers?: Headers): Response {
  return Response.json(body, { status, headers });
}

function featureHeaders(): Headers {
  return new Headers({
    'X-Feature-clients': 'true',
    'X-Feature-accounts': 'true',
    'X-Feature-transactions': 'true',
    'X-Feature-reports': 'true',
  });
}

function errorResponse(error: unknown, path: string): Response {
  if (error instanceof GatewayUnauthorizedError) {
    return json({
      status: 401,
      error: 'Unauthorized',
      message: error.message,
    }, 401);
  }

  if (error instanceof RequestValidationError) {
    const isAuthPath = path.startsWith('/auth/');
    return json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: isAuthPath ? 'Validation error' : 'Bad Request',
      message: error.message,
      path,
      validationErrors: error.validationErrors,
    }, 400);
  }

  if (error instanceof DomainHttpError) {
    return json({
      timestamp: new Date().toISOString(),
      status: error.status,
      error: error.error,
      message: error.message,
      path,
    }, error.status);
  }

  console.error(JSON.stringify({
    message: 'unhandled worker error',
    error: error instanceof Error ? error.message : String(error),
    path,
  }));

  return json({
    timestamp: new Date().toISOString(),
    status: 500,
    error: 'Internal Server Error',
    message: 'Internal server error',
    path,
  }, 500);
}

function applyEnv(env: Env): void {
  for (const key of ['DAILY_WITHDRAWAL_LIMIT', 'JWT_EXPIRATION_MS', 'JWT_SECRET']) {
    const value = env[key as keyof Env];
    if (typeof value === 'string') {
      process.env[key] = value;
    }
  }
}

function withCors(response: Response, request: Request): Response {
  const origin = request.headers.get('origin');
  const headers = new Headers(response.headers);
  headers.set('access-control-allow-origin', origin ?? '*');
  headers.set('access-control-allow-credentials', 'true');
  headers.set('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('access-control-allow-headers', request.headers.get('access-control-request-headers') ?? '*');
  headers.set('access-control-max-age', '3600');
  if (origin) {
    headers.append('vary', 'Origin');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function toValidationErrors(errors: ValidationError[]): Record<string, string> {
  const output: Record<string, string> = {};
  const visit = (error: ValidationError, prefix = '') => {
    const field = prefix ? `${prefix}.${error.property}` : error.property;
    if (error.constraints && Object.keys(error.constraints).length > 0) {
      output[field] = pickConstraintMessage(error.constraints);
    }
    error.children?.forEach((child) => visit(child, field));
  };
  errors.forEach((error) => visit(error));
  return output;
}

function pickConstraintMessage(constraints: Record<string, string>): string {
  const priority = [
    'isDefined',
    'matches',
    'minLength',
    'isLength',
    'maxLength',
    'min',
    'isInt',
    'isNumber',
    'isBoolean',
    'isString',
  ];
  const key = priority.find((item) => constraints[item]);
  return constraints[key ?? Object.keys(constraints)[0]];
}
