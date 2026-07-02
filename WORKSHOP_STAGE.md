# Workshop 06 - RouterTestingHarness e Integracion Angular

Esta rama nace desde `workshop/05-testing-http-interceptors` y cierra el workshop con la suite completa.

## Codigo agregado en esta sesion

- Specs de guards con `RouterTestingHarness`.
- Specs de login flow.
- Specs de edicion con route params y `withComponentInputBinding()`.
- Specs de pages/listados con providers reales de Angular.
- Specs de layout.
- Suite final completa del frontend.

## Guion de 1h 30m

1. 0-15 min: cuando usar `RouterTestingHarness`.
2. 15-35 min: `auth.guard.spec.ts`.
3. 35-55 min: `login.component.spec.ts`.
4. 55-72 min: `account-edit.component.spec.ts` y route params.
5. 72-82 min: frontera unit/component/integration.
6. 82-90 min: ejercicio: agregar redirect o param invalido.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
