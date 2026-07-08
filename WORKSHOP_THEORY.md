# Workshop 03 - HTTP, Errores y Analytics - Teoria y ejemplos

Esta sesion cierra la app funcional con reportes, interceptores, manejo global de errores y analytics por providers composables.

## Navegacion

- [Inicio local](README.md).
- [Temario y recorrido](WORKSHOP_STAGE.md).

## Teoria Angular

### Servicios HTTP como borde

Un servicio HTTP traduce el contrato del backend a un contrato usable por la UI. La normalizacion debe vivir cerca del borde para evitar parsing duplicado en componentes.

Ejemplo minimo:

```ts
getReport(filters: ReportFilters) {
  const params = new HttpParams()
    .set('clientId', filters.clientId)
    .set('from', filters.from)
    .set('to', filters.to);

  return this.http.get<ReportResponse>('/api/reportes', { params });
}
```

### Interceptores funcionales

Angular permite interceptores funcionales. Son funciones predecibles que reciben request y `next`.

Ejemplo minimo:

```ts
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthService).token();

  return next(
    token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request,
  );
};
```

### HttpContext

`HttpContext` permite controlar comportamiento transversal por request sin depender de URLs ni query params artificiales.

Ejemplo minimo:

```ts
export const SKIP_ERROR_INTERCEPTOR = new HttpContextToken(() => false);

this.http.get("/api/reportes", {
  context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true),
});
```

### Global error handler

`ErrorHandler` captura errores no manejados por flujos normales. No reemplaza validaciones de dominio ni errores HTTP esperados.

Ejemplo minimo:

```ts
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    inject(Logger).error(error);
  }
}
```

### Analytics por strategies

Analytics debe depender de un contrato propio, no de un SDK global en cada componente.

Ejemplo minimo:

```ts
export interface AnalyticsStrategy {
  track(event: AnalyticsEvent): void;
}

export function provideAnalytics(
  strategy: Type<AnalyticsStrategy>,
): Provider[] {
  return [{ provide: AnalyticsStrategyToken, useClass: strategy }];
}
```

### Directiva de tracking

Una directiva permite declarar eventos en template sin acoplar el componente al adapter.

Ejemplo minimo:

```html
<button appClickTracking="report.download">Descargar</button>
```

## Documentacion oficial

- HTTP client: https://angular.dev/guide/http
- HTTP interceptors: https://angular.dev/guide/http/interceptors
- `HttpContext`: https://angular.dev/api/common/http/HttpContext
- Dependency injection: https://angular.dev/guide/di
- Unhandled errors: https://angular.dev/best-practices/error-handling
