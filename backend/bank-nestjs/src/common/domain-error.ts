export class DomainHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly error: string,
    message: string,
  ) {
    super(message);
  }
}

export class GatewayUnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class RequestValidationError extends Error {
  constructor(public readonly validationErrors: Record<string, string>) {
    super('The provided data is not valid');
  }
}

export const notFound = (resource: string, field: string, value: unknown) =>
  new DomainHttpError(
    404,
    'Not Found',
    `${resource} not found with ${field}: '${String(value)}'`,
  );

export const badRequest = (message: string) =>
  new DomainHttpError(400, 'Bad Request', message);

export const conflict = (message: string) =>
  new DomainHttpError(409, 'Conflict', message);
