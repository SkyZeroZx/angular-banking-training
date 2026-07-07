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

Mini ejercicio:

1. Abrir pagina de reportes.
2. Cambiar rango de fechas.
3. Seguir flujo: form -> service -> normalizacion -> tabla.

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

Mini ejercicio:

1. Login.
2. Abrir DevTools Network.
3. Ver header `Authorization` en `/api/reportes`.

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

Mini ejercicio:

1. Buscar uso de `SKIP_ERROR_INTERCEPTOR`.
2. Comparar request normal vs request con opt-out.
3. Explicar por que no conviene usar headers internos.

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

Mini ejercicio:

1. Forzar endpoint con token invalido.
2. Ver toast y redireccion si aplica.
3. Identificar donde se conserva el error original.

## Ejemplo 5 - GlobalErrorHandler

Archivos base:

- `frontend/banking-front/src/app/core/errors/global-error-handler.ts`
- `frontend/banking-front/src/app/app.config.ts`

Punto a explicar:

```ts
providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }];
```

`GlobalErrorHandler` cubre errores fuera del flujo HTTP: callbacks, eventos, errores de render o promises no manejadas.

Mini ejercicio:

1. Lanzar un error desde un boton temporal.
2. Confirmar que no pasa por interceptor HTTP.
3. Revisar salida del handler global.

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

Mini ejercicio:

1. Agregar tracking a un boton.
2. Click en la UI.
3. Ver evento en consola sin acoplar componente a vendor.
