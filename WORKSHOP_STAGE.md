# Workshop 03 - HTTP, Errores y Analytics

Esta rama nace desde `workshop/02-ui-cva-forms` y completa la app Angular funcional.

## Codigo agregado en esta sesion

- Reportes y `ReportService`.
- Normalizacion de respuestas de reporte.
- `errorInterceptor` con `HttpContext`.
- `GlobalErrorHandler`.
- Analytics por strategy con `provideAnalytics()` y `withGtag()`.
- `ClickTrackingDirective`.
- App config final con interceptores, toast, error handler y analytics.

## Aun no existe en esta rama

- Suite completa de tests unitarios/integracion.
- Helpers de testing.
- RouterTestingHarness specs.

## Guion de 1h 30m

1. 0-12 min: comparar rama 02 vs 03: aparece `ReportsComponent` y capa transversal final.
2. 12-28 min: `ReportService`: parametros, descarga y normalizacion de respuestas de reporte.
3. 28-42 min: `ReportsComponent`: form de filtros, request de reporte y link de descarga.
4. 42-56 min: `authInterceptor`, `errorInterceptor` y `SKIP_ERROR_INTERCEPTOR`: protocolo HTTP centralizado.
5. 56-68 min: `GlobalErrorHandler`: errores inesperados fuera del flujo HTTP normal.
6. 68-82 min: `AnalyticsAdapter`, `provideAnalytics()` y `ClickTrackingDirective`: strategy por DI.
7. 82-90 min: ejercicio: agregar un status al `errorInterceptor` o una strategy nueva de analytics.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
