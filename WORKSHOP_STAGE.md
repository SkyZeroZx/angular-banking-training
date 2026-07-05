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

## Recorrido

1. Diferencia estructural entre rama 02 y rama 03.
2. Flujo de reporte: form -> service -> normalizacion -> descarga.
3. Interceptores funcionales y orden de `provideHttpClient`.
4. `HttpContext` como opt-out tipado para comportamiento transversal.
5. `GlobalErrorHandler` para errores fuera del flujo HTTP.
6. Analytics con adapter, strategies y directive.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
