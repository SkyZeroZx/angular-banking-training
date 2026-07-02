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

1. 0-15 min: servicios HTTP y frontera componente/servicio.
2. 15-30 min: reportes y normalizacion de backend.
3. 30-45 min: auth + error interceptors.
4. 45-60 min: `HttpContext` para saltar manejo global.
5. 60-72 min: `GlobalErrorHandler`.
6. 72-82 min: analytics strategy tree-shakeable.
7. 82-90 min: ejercicio: agregar otra strategy o status de error.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
