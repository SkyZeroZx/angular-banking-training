# Workshop 05 - Teoria Angular Testing

Esta rama agrega tests de servicios HTTP e interceptores.

## Objetivo

Probar el contrato HTTP real de la aplicacion sin llamar backend y sin convertir tests en mocks de implementacion.

## Temario de sesion

1. Testing HTTP sin backend real.
2. `HttpTestingController`: `expectOne`, `flush`, errores y `verify`.
3. Specs de servicios CRUD.
4. Query params, headers y body como contrato.
5. Report service y normalizacion de responses.
6. Interceptores con `provideHttpClient(withInterceptors(...))`.
7. Orden `provideHttpClient` / `provideHttpClientTesting`.
8. Opt-out con `HttpContext`.

## 1. HttpTestingController

`HttpTestingController` reemplaza backend real por backend de test. Permite afirmar request y responder con `flush`.

Debe validar:

- metodo;
- URL;
- params;
- headers;
- body;
- response/error;
- requests pendientes con `verify()`.

## 2. Tests de servicios

Un servicio HTTP se prueba por contrato externo:

- endpoint correcto;
- query params correctos;
- payload correcto;
- transformacion esperada de response.

No se prueba que "llame a HttpClient" como detalle interno; se observa request resultante.

## 3. Orden de providers

Cuando un test configura HTTP features, primero va `provideHttpClient(...)` y despues `provideHttpClientTesting()`.

Ese orden importa porque el testing backend debe reemplazar backend real sin perder features como interceptores.

## 4. Interceptores

Los interceptores se prueban con `provideHttpClient(withInterceptors([...]))`.

En esta rama:

- `auth.interceptor.spec.ts` valida header Authorization.
- `error.interceptor.spec.ts` valida status, toast, redirect y opt-out.

## 5. Report service

`report.service.spec.ts` cubre el contrato particular pedido: respuestas base64 y array. Es decision de borde, no parsing general inventado.

## 6. Helpers HTTP

`http.spec-helper.ts` existe para eliminar repeticion comun, no para esconder asserts importantes.

Un helper bueno hace que el test diga mejor "que request espero".

## Material extra

- [Matriz HttpTestingController](extra/http-testing-matrix.md)
- [Orden de providers HTTP](extra/http-provider-order.md)

## Fuentes oficiales

- HTTP testing: https://angular.dev/guide/http/testing
- Component testing scenarios: https://angular.dev/guide/testing/components-scenarios
- `HttpTestingController`: https://angular.dev/api/common/http/testing/HttpTestingController
- HTTP interceptors: https://angular.dev/guide/http/interceptors
