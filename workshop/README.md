# Workshop 06 - Teoria Angular Testing

Esta rama cierra el workshop con integration tests de router, guards, pages y layout.

## Objetivo

Probar flujos de navegacion Angular con router realista, sin subir a Cypress y sin mockear el router.

## Temario de sesion

1. Boundary entre unit, component integration, router integration y E2E.
2. `RouterTestingHarness` como API para navegacion en tests.
3. Guards probados por navegacion observable.
4. Login flow con providers fake.
5. Edit pages con route params y `withComponentInputBinding()`.
6. Create/list page specs y assertions de DOM.
7. Layout specs con shell y outlet.
8. Cierre de piramide de testing Angular.

## 1. Integration test Angular

Un integration test de page valida colaboracion entre:

- router;
- componente;
- template;
- providers;
- servicios fake o test doubles;
- DOM visible.

No es E2E completo porque no usa navegador real ni backend real. Tampoco es unit test puro porque involucra Angular runtime.

## 2. RouterTestingHarness

`RouterTestingHarness` permite navegar con rutas reales de test y obtener el componente renderizado.

Sirve para:

- route params;
- query params;
- redirects;
- guards;
- nested routes;
- outlets.

## 3. Guards

Los guards se prueban por resultado de navegacion, no llamando la funcion como util aislado.

En esta rama, `auth.guard.spec.ts` valida:

- usuario autenticado entra;
- usuario no autenticado redirige;
- resultado visible tras navegacion.

## 4. Edit pages y component input binding

Las pantallas edit usan route params. El test debe cubrir que el param llega al componente y dispara el flujo esperado.

Si la app usa `withComponentInputBinding()`, el test debe navegar por URL real, no setear input manualmente.

## 5. Page specs

Create/list page specs validan interaccion de template y providers fake:

- render inicial;
- submit;
- navegacion;
- servicios llamados por contrato publico;
- estados visibles.

## 6. Layout specs

Layout specs verifican que shell, header, sidebar, footer y outlet trabajen juntos. No necesitan backend ni rutas reales completas.

## 7. Boundary unit/integration/E2E

- Unit: funcion, servicio, pipe, adapter.
- Component integration: template + DOM + TestBed.
- Router integration: route config + harness + guards.
- E2E: navegador real + backend o entorno completo.

## Material extra

- [Escenarios RouterTestingHarness](extra/router-testing-scenarios.md)
- [Boundaries de testing](extra/testing-boundaries.md)

## Fuentes oficiales

- Testing routing and navigation: https://angular.dev/guide/routing/testing
- Basics of testing components: https://angular.dev/guide/testing/components-basics
- Component testing scenarios: https://angular.dev/guide/testing/components-scenarios
- Testing services: https://angular.dev/guide/testing/services
