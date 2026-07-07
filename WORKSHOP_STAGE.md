# Workshop 05 - Testing HTTP, Interceptores y RouterTestingHarness

Sesion fusionada: testing HTTP/interceptores y testing de router/integracion Angular en un solo workshop. Mantiene el mismo alcance que antes tenian las sesiones 05 y 06.

## Material

- [Inicio local](README.md).
- [Teoria y ejemplos](WORKSHOP_THEORY.md).
- [Ejemplos guiados](WORKSHOP_EXAMPLES.md).

## Teoria

- [HttpTestingController](WORKSHOP_THEORY.md#httptestingcontroller).
- [Tests de servicios](WORKSHOP_THEORY.md#tests-de-servicios).
- [Orden de providers HTTP](WORKSHOP_THEORY.md#orden-de-providers-http).
- [Interceptores](WORKSHOP_THEORY.md#interceptores).
- [HttpContext en tests](WORKSHOP_THEORY.md#httpcontext-en-tests).
- [Integration test Angular](WORKSHOP_THEORY.md#integration-test-angular).
- [RouterTestingHarness](WORKSHOP_THEORY.md#routertestingharness).
- [Guards por navegacion](WORKSHOP_THEORY.md#guards-por-navegacion).
- [Route params y component input binding](WORKSHOP_THEORY.md#route-params-y-component-input-binding).
- [Page specs](WORKSHOP_THEORY.md#page-specs).
- [Testing boundaries](WORKSHOP_THEORY.md#testing-boundaries).

## Estructura

- `spec-helpers/http.spec-helper.ts`.
- `core/services/client/client.service.spec.ts`.
- `core/services/account/account.service.spec.ts`.
- `core/services/movement/movement.service.spec.ts`.
- `core/services/report/report.service.spec.ts`.
- `core/interceptors/auth.interceptor.spec.ts`.
- `core/interceptors/error.interceptor.spec.ts`.
- `core/guards/auth.guard.spec.ts`.
- `pages/login/login.component.spec.ts`.
- `pages/accounts/edit/account-edit.component.spec.ts`.
- `pages/clients/edit/client-edit.component.spec.ts`.
- Specs create/list de clients, accounts y movements.
- Specs de `layout/content` y componentes `header`, `side-bar`, `footer`.

## Recorrido

1. Diferencia estructural entre rama 04 y rama 05 fusionada.
2. `HttpTestingController`: request, flush, error y `verify`.
3. Tests CRUD de servicios con params, body y normalizacion de reportes.
4. Interceptores de auth/error, orden de providers y `HttpContext`.
5. `RouterTestingHarness` y rutas de test.
6. Guards por resultado de navegacion.
7. Login flow con router y providers fake.
8. Edit specs con route params y component input binding.
9. Page specs y layout specs como integration tests.

## Ampliacion oficial

- https://angular.dev/guide/http/testing
- https://angular.dev/guide/http/interceptors
- https://angular.dev/guide/routing/testing
- https://angular.dev/guide/testing/components-basics
- https://angular.dev/guide/testing/components-scenarios
- https://angular.dev/guide/testing/services

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
