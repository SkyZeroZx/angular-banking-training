# Extra - Matriz HttpTestingController

## Request feliz

- Ejecutar metodo del servicio.
- `expectOne`.
- Validar method + URL.
- Validar params.
- Validar body si aplica.
- `flush(response)`.
- Assert final del observable.
- `verify()`.

## Error HTTP

- Ejecutar metodo.
- `expectOne`.
- `flush(errorBody, { status, statusText })`.
- Assert de error o fallback.
- `verify()`.

## Interceptor

- Configurar `provideHttpClient(withInterceptors([...]))`.
- Configurar `provideHttpClientTesting()`.
- Ejecutar request.
- Validar request transformado.
- `flush`.
- Assert observable.

## No hacer

- No mockear `HttpClient`.
- No afirmar implementacion interna.
- No olvidar `verify()`.
- No dejar requests sin flush.
