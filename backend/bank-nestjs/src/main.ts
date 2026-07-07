import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { RequestValidationError } from './common/domain-error';
import { AppModule } from './app.module';

export function configureApp(app: INestApplication) {
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: true,
    maxAge: 3600,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
      whitelist: false,
      exceptionFactory: (errors) => new RequestValidationError(toValidationErrors(errors)),
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  configureApp(app);
  await app.listen(Number(process.env.PORT ?? 8080));
}

void bootstrap();

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
