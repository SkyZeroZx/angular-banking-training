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

## Practica

1. Comparar rama 04 vs 05.
2. Revisar helper HTTP y un spec CRUD.
3. Revisar specs de interceptores con `SKIP_ERROR_INTERCEPTOR`.
4. Ejercicio: agregar caso 422 o validar que un param opcional no se envie.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
