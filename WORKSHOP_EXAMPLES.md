# Workshop 03 - Ejemplos guiados

Estos ejemplos aterrizan HTTP, errores y analytics en archivos reales de esta rama.

## Ejemplo 1 - Servicio HTTP como borde

Archivos base:

- `frontend/banking-front/src/app/core/services/report/report.service.ts`
- `frontend/banking-front/src/app/pages/reports/reports.component.ts`

Punto a explicar:

```ts
getReport(params: ReportParams) {
  return this.http.get<ReportApiResponse>(this.baseUrl, { params });
}
```

El service conoce HTTP y normaliza respuesta. El componente trabaja con datos de UI.


## Ejemplo 2 - Interceptor de auth

Archivos base:

- `frontend/banking-front/src/app/core/interceptors/auth.interceptor.ts`
- `frontend/banking-front/src/app/app.config.ts`

Punto a explicar:

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
```

El interceptor agrega headers sin ensuciar cada service.


## Ejemplo 3 - HttpContext como opt-out

Archivos base:

- `frontend/banking-front/src/app/core/http/http-context.tokens.ts`
- `frontend/banking-front/src/app/core/interceptors/error.interceptor.ts`
- `frontend/banking-front/src/app/core/services/report/report.service.ts`

Punto a explicar:

```ts
new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true);
```

`HttpContext` evita flags por string y permite decisiones transversales por request.


## Ejemplo 4 - Error interceptor y toast

Archivos base:

- `frontend/banking-front/src/app/core/interceptors/error.interceptor.ts`
- `frontend/banking-front/src/app/shared/ui/toast/toast.service.ts`

Punto a explicar:

```ts
return next(req).pipe(
  catchError((error) => {
    toast.error(resolveMessage(error));
    return throwError(() => error);
  }),
);
```

El interceptor estandariza errores HTTP. El componente no repite parsing de errores.


## Ejemplo 5 - GlobalErrorHandler

Archivos base:

- `frontend/banking-front/src/app/core/errors/global-error-handler.ts`
- `frontend/banking-front/src/app/app.config.ts`

Punto a explicar:

```ts
providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }];
```

`GlobalErrorHandler` cubre errores fuera del flujo HTTP: callbacks, eventos, errores de render o promises no manejadas.


## Ejemplo 6 - Analytics con strategies

Archivos base:

- `frontend/banking-front/src/app/core/services/analytics/analytics.adapter.ts`
- `frontend/banking-front/src/app/core/services/analytics/console.analytics.ts`
- `frontend/banking-front/src/app/core/services/analytics/gtag.analytics.ts`
- `frontend/banking-front/src/app/shared/directives/click-tracking/click-tracking.directive.ts`

Punto a explicar:

```ts
track(event: AnalyticsEvent): void;
```

La directiva dispara eventos. El adapter decide si usa consola, gtag u otra salida.

