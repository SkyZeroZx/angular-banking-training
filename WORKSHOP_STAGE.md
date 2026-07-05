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

## Practica

1. Comparar rama 05 vs 06.
2. Revisar redirect de `auth.guard.spec.ts`.
3. Revisar edit specs con route params.
4. Ejercicio: agregar redirect o caso de param invalido.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
