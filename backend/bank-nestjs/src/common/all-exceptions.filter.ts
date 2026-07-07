import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  DomainHttpError,
  GatewayUnauthorizedError,
  RequestValidationError,
} from './domain-error';

interface HttpRequestLike {
  path?: string;
  url?: string;
}

interface HttpResponseLike {
  status?: (status: number) => HttpResponseLike;
  code?: (status: number) => HttpResponseLike;
  json?: (body: unknown) => void;
  send?: (body: unknown) => void;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<HttpRequestLike>();
    const response = ctx.getResponse<HttpResponseLike>();
    const path = getPath(request);

    if (exception instanceof GatewayUnauthorizedError) {
      reply(response, HttpStatus.UNAUTHORIZED, {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Unauthorized',
        message: exception.message,
      });
      return;
    }

    if (exception instanceof RequestValidationError) {
      const isAuthPath = path.startsWith('/auth/');
      reply(response, HttpStatus.BAD_REQUEST, {
        timestamp: new Date().toISOString(),
        status: HttpStatus.BAD_REQUEST,
        error: isAuthPath ? 'Validation error' : 'Bad Request',
        message: exception.message,
        path,
        validationErrors: exception.validationErrors,
      });
      return;
    }

    if (exception instanceof DomainHttpError) {
      reply(response, exception.status, {
        timestamp: new Date().toISOString(),
        status: exception.status,
        error: exception.error,
        message: exception.message,
        path,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'object' && body !== null && 'message' in body
          ? String((body as { message: unknown }).message)
          : exception.message;

      reply(response, status, {
        timestamp: new Date().toISOString(),
        status,
        error: exception.name,
        message,
        path,
      });
      return;
    }

    reply(response, HttpStatus.INTERNAL_SERVER_ERROR, {
      timestamp: new Date().toISOString(),
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Internal server error',
      path,
    });
  }
}

function getPath(request: HttpRequestLike): string {
  return (request.path ?? request.url ?? '').split('?')[0] || '/';
}

function reply(response: HttpResponseLike, status: number, body: unknown): void {
  const responder =
    typeof response.status === 'function' ? response.status(status) : response.code?.(status);

  if (responder && typeof responder.json === 'function') {
    responder.json(body);
    return;
  }

  (responder ?? response).send?.(body);
}
