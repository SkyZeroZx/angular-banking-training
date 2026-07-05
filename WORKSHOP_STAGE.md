# Workshop 03 - HTTP, Errores y Analytics

Tercer corte: la app funcional queda completa con reportes y capa transversal.

## Teoria

- HTTP centralizado: servicios pequenos, parametros explicitos y normalizacion en borde.
- Interceptores funcionales: auth header, manejo de errores y opt-out con `HttpContext`.
- Error global: errores fuera del flujo HTTP normal.
- Analytics por DI: providers composables, strategies y bajo acoplamiento.

## Estructura

- `core/services/report/report.service.ts`.
- `pages/reports/reports.component.ts`.
- `core/interceptors/auth.interceptor.ts`.
- `core/interceptors/error.interceptor.ts`.
- `core/http/http-context.tokens.ts`.
- `core/errors/global-error-handler.ts`.
- `core/services/analytics` y `shared/directives/click-tracking`.

## Practica

1. Comparar rama 02 vs 03.
2. Seguir flujo de reporte: form -> service -> descarga.
3. Revisar protocolo de error en interceptor y `SKIP_ERROR_INTERCEPTOR`.
4. Ejercicio: agregar una strategy nueva de analytics o un status nuevo al error handler.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
