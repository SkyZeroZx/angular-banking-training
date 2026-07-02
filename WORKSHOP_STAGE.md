# Workshop 05 - Testing HTTP, Servicios e Interceptores

Esta rama nace desde `workshop/04-testing-components-cva` y agrega la segunda capa real de testing.

## Codigo agregado en esta sesion

- Specs de servicios HTTP: auth, client, account, movement y report.
- Specs de interceptores: auth y error.
- Spec de analytics gtag adapter.
- Uso de `HttpTestingController`.
- Validacion de params, headers, `flush` y `verify`.
- Uso de `SKIP_ERROR_INTERCEPTOR`.

## Aun no existe en esta rama

- RouterTestingHarness specs.
- Specs de pages/flows con route params.

## Guion de 1h 30m

1. 0-10 min: comparar rama 04 vs 05: ahora aparecen specs bajo `core/services` y `core/interceptors`.
2. 10-22 min: `http.spec-helper.ts`: `setupHttpService`, `expectRequest`, params y `pagedResponse`.
3. 22-42 min: `client.service.spec.ts`, `account.service.spec.ts` y `movement.service.spec.ts`: requests CRUD y query params.
4. 42-58 min: `report.service.spec.ts`: respuestas array/base64/reporte y normalizacion.
5. 58-72 min: `auth.interceptor.spec.ts`: token fake, `provideHttpClient(withInterceptors(...))` y header Authorization.
6. 72-84 min: `error.interceptor.spec.ts`: status, toast, redirect, `SKIP_ERROR_INTERCEPTOR` y `verify`.
7. 84-90 min: ejercicio: agregar caso 422 o validar que un parametro opcional no se envie.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
