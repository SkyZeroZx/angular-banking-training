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

1. 0-10 min: comparar rama 05 vs 06: ahora aparecen specs de `pages`, `layout` y `guards`.
2. 10-28 min: `auth.guard.spec.ts`: `RouterTestingHarness`, rutas fake y redirects.
3. 28-44 min: `login.component.spec.ts`: navegacion a `/login`, submit exitoso y error de auth.
4. 44-62 min: `account-edit.component.spec.ts` y `client-edit.component.spec.ts`: route params + `withComponentInputBinding()`.
5. 62-76 min: create/list page specs: `provideRouter`, providers fake y asserts de comportamiento.
6. 76-84 min: layout specs: `content`, `header`, `side-bar` y `footer`.
7. 84-90 min: ejercicio: agregar redirect o caso de param invalido.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
