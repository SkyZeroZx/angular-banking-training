import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { RequestValidationError } from './common/domain-error';

interface ConfigureAppOptions {
  cors?: boolean;
}

export function configureApp(app: INestApplication, options: ConfigureAppOptions = {}) {
  if (options.cors !== false) {
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*'],
      credentials: true,
      maxAge: 3600,
    });
  }

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
