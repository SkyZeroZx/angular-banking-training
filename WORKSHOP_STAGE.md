# Workshop 05 - Testing HTTP, Servicios e Interceptores

Segundo corte de testing: requests HTTP, interceptores y normalizacion de respuestas.

## Teoria

- `HttpTestingController`: assert de metodo, URL, params, headers, body y `flush`.
- Tests de servicios: validar contrato HTTP, no detalles internos.
- Tests de interceptores: `provideHttpClient(withInterceptors(...))` y providers fake.
- Limpieza: `httpMock.verify()` para detectar requests pendientes.

## Estructura

- `spec-helpers/http.spec-helper.ts`.
- `core/services/client/client.service.spec.ts`.
- `core/services/account/account.service.spec.ts`.
- `core/services/movement/movement.service.spec.ts`.
- `core/services/report/report.service.spec.ts`.
- `core/interceptors/auth.interceptor.spec.ts`.
- `core/interceptors/error.interceptor.spec.ts`.

## Recorrido

1. Diferencia estructural entre rama 04 y rama 05.
2. `HttpTestingController`: request, `flush`, error y `verify`.
3. Tests CRUD de servicios con params y body.
4. `report.service.spec.ts`: normalizacion de respuestas.
5. `auth.interceptor.spec.ts`: header Authorization.
6. `error.interceptor.spec.ts`: status, toast, redirect y `SKIP_ERROR_INTERCEPTOR`.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
