# Angular Banking Training

Repositorio full-stack para capacitacion Angular. Cada rama `workshop/*` es un snapshot incremental y ejecutable.

## Rama Actual

Lee [WORKSHOP_STAGE.md](WORKSHOP_STAGE.md) para ver como dictar esta sesion y donde ampliar cada tema en la documentacion oficial.

## Ramas

| Rama                                     | Sesion    | Incremento real                                        |
| ---------------------------------------- | --------- | ------------------------------------------------------ |
| `workshop/01-shell-routing-signals`      | Angular 1 | Shell, login, rutas lazy, guards, clientes con signals |
| `workshop/02-ui-cva-forms`               | Angular 2 | UI propia, CVA, formularios, cuentas y movimientos     |
| `workshop/03-http-errors-analytics`      | Angular 3 | Reportes, interceptores, error global, analytics       |
| `workshop/04-testing-components-cva`     | Testing 1 | Helpers DOM, component tests, CVA tests                |
| `workshop/05-testing-http-interceptors`  | Testing 2 | HttpTestingController, servicios, interceptores        |
| `workshop/06-testing-router-integration` | Testing 3 | RouterTestingHarness, guards, flows de paginas         |

## Ejecucion Local

Backend local con H2:

```bash
cd backend
mvn -pl auth-service spring-boot:run
```

```bash
cd backend
mvn -pl banking-service spring-boot:run
```

```bash
cd backend
mvn -pl api-gateway spring-boot:run
```

Frontend:

```bash
cd frontend/banking-front
npm ci
npm start
```

Login local:

| Usuario | Password   |
| ------- | ---------- |
| `admin` | `admin123` |

## Validacion

Frontend:

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```

Backend:

```bash
cd backend
mvn test
```

## Servicios

| Servicio        | URL                                |
| --------------- | ---------------------------------- |
| API Gateway     | `http://localhost:8080`            |
| Banking Service | `http://localhost:8090`            |
| Auth Service    | `http://localhost:8091`            |
| H2 Auth         | `http://localhost:8091/h2-console` |
| H2 Banking      | `http://localhost:8090/h2-console` |

H2 usa usuario `sa` y password vacio.

## Workshop 03 - HTTP, Errores y Analytics

Esta sesion cierra la app funcional con reportes, interceptores, manejo global de errores y analytics por providers composables.

## Temario

1. Servicios HTTP como borde de integracion.
2. Reportes: parametros, normalizacion y descarga.
3. Interceptores funcionales con `withInterceptors`.
4. `HttpContext` como metadata tipada por request.
5. Error global vs errores esperados del flujo.
6. Analytics por adapter, strategy providers y directive.

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
