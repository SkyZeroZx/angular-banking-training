# Workshop 03 - HTTP, Errores y Analytics

Tercer corte: la app funcional queda completa con reportes y capa transversal.

## Teoria

- [Servicios HTTP como borde](README.md#servicios-http-como-borde).
- [Interceptores funcionales](README.md#interceptores-funcionales).
- [HttpContext](README.md#httpcontext).
- [Global error handler](README.md#global-error-handler).
- [Analytics por strategies](README.md#analytics-por-strategies).
- [Directiva de tracking](README.md#directiva-de-tracking).

## Estructura

- `core/services/report/report.service.ts`.
- `pages/reports/reports.component.ts`.
- `core/interceptors/auth.interceptor.ts`.
- `core/interceptors/error.interceptor.ts`.
- `core/http/http-context.tokens.ts`.
- `core/errors/global-error-handler.ts`.
- `core/services/analytics` y `shared/directives/click-tracking`.

## Recorrido

1. Diferencia estructural entre rama 02 y rama 03.
2. Flujo de reporte: form -> service -> normalizacion -> descarga.
3. Interceptores funcionales y orden de `provideHttpClient`.
4. `HttpContext` como opt-out tipado para comportamiento transversal.
5. `GlobalErrorHandler` para errores fuera del flujo HTTP.
6. Analytics con adapter, strategies y directive.

## Ampliacion oficial

- https://angular.dev/guide/http
- https://angular.dev/guide/http/interceptors
- https://angular.dev/api/common/http/HttpContext
- https://angular.dev/guide/di

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
