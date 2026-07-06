# Workshop 06 - RouterTestingHarness e Integracion Angular

Corte final: suite completa con guards, rutas, pages y layout.

## Material

- [Inicio local](README.md).
- [Teoria y ejemplos](WORKSHOP_THEORY.md).

## Teoria

- [Integration test Angular](WORKSHOP_THEORY.md#integration-test-angular).
- [RouterTestingHarness](WORKSHOP_THEORY.md#routertestingharness).
- [Guards por navegacion](WORKSHOP_THEORY.md#guards-por-navegacion).
- [Route params y component input binding](WORKSHOP_THEORY.md#route-params-y-component-input-binding).
- [Page specs](WORKSHOP_THEORY.md#page-specs).
- [Testing boundaries](WORKSHOP_THEORY.md#testing-boundaries).

## Estructura

- `core/guards/auth.guard.spec.ts`.
- `pages/login/login.component.spec.ts`.
- `pages/accounts/edit/account-edit.component.spec.ts`.
- `pages/clients/edit/client-edit.component.spec.ts`.
- Specs create/list de clients, accounts y movements.
- Specs de `layout/content` y componentes `header`, `side-bar`, `footer`.

## Recorrido

1. Diferencia estructural entre rama 05 y rama 06.
2. `RouterTestingHarness` y rutas de test.
3. Guards por resultado de navegacion.
4. Login flow con router y providers fake.
5. Edit specs con route params y component input binding.
6. Page specs y layout specs como integration tests.

## Ampliacion oficial

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
