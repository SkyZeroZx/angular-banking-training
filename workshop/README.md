# Workshop 03 - Teoria Angular

Esta rama cierra la app funcional: reportes, HTTP transversal, manejo de errores y analytics composable.

## Objetivo

Centralizar reglas de comunicacion y observabilidad sin contaminar componentes de pagina.

## Temario de sesion

1. Servicios HTTP como borde de integracion.
2. Reportes: parametros, response normalization y descarga.
3. Interceptores funcionales con `withInterceptors`.
4. `HttpContext` para metadata por request.
5. Manejo global de errores vs manejo local esperado.
6. Analytics por adapter y strategy providers.
7. Directiva de tracking declarativa en template.
8. Cierre de arquitectura transversal.

## 1. Servicios HTTP como borde

Los servicios deben hablar el idioma del backend y normalizar lo minimo necesario para que la UI no repita parsing.

En esta rama:

- `ReportService` arma params de reporte.
- Normaliza respuestas base64/array segun contrato recibido.
- Mantiene la descarga fuera del componente.

## 2. Interceptores funcionales

Angular recomienda interceptores funcionales por comportamiento mas predecible. Un interceptor puede clonar request, agregar headers, transformar response o manejar errores.

En esta rama:

- `authInterceptor` agrega `Authorization`.
- `errorInterceptor` centraliza toast/redirect/logica de error.
- `provideHttpClient(withInterceptors([...]))` registra la cadena.

## 3. `HttpContext`

`HttpContext` permite metadata type-safe por request. Sirve para opt-in/opt-out de comportamiento transversal sin agregar flags raros al endpoint.

En esta rama, `SKIP_ERROR_INTERCEPTOR` permite que un request evite manejo global de error cuando el flujo necesita control propio.

## 4. Global error handler

`GlobalErrorHandler` captura errores fuera del flujo HTTP normal. No reemplaza manejo local ni interceptores; cubre fallos inesperados de UI/runtime.

Regla: errores esperados del dominio se manejan cerca del flujo; errores inesperados se reportan globalmente.

## 5. Analytics por strategies

Analytics no debe acoplar componentes a una implementacion concreta. La app usa adapter + providers composables:

- `AnalyticsAdapter` define contrato.
- Strategies concretas implementan envio.
- `provideAnalytics()` compone providers.
- `ClickTrackingDirective` emite eventos desde template.

## 6. Componentes limpios

`ReportsComponent` no debe saber como se parsea un response ni como se trackea cada destino de analytics. Solo coordina formulario, request y feedback visible.

## Material extra

- [HttpContext y opt-out](extra/http-context-opt-out.md)
- [Analytics strategy provider](extra/analytics-strategy-provider.md)

## Fuentes oficiales

- HTTP interceptors: https://angular.dev/guide/http/interceptors
- `HttpInterceptorFn`: https://angular.dev/api/common/http/HttpInterceptorFn
- `HttpContext`: https://angular.dev/api/common/http/HttpContext
- `provideHttpClient`: https://angular.dev/api/common/http/provideHttpClient
- Dependency injection: https://angular.dev/guide/di
