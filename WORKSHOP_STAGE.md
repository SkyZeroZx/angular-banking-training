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

1. 0-10 min: unit puro vs integracion liviana HTTP.
2. 10-25 min: `http.spec-helper.ts`.
3. 25-45 min: service specs y `req.flush`.
4. 45-62 min: auth interceptor con header.
5. 62-80 min: error interceptor y `HttpContext`.
6. 80-90 min: ejercicio: agregar caso 422 o param opcional.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
