# Workshop 06 - RouterTestingHarness e Integracion Angular

Corte final: suite completa con guards, rutas, pages y layout.

## Teoria

- Integration test Angular: probar flujo visible entre router, template y providers.
- `RouterTestingHarness`: navegacion realista sin Cypress.
- Params y inputs: validar `withComponentInputBinding()` en edicion.
- Boundaries: unit tests para servicios, integration tests para page flows.

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

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
