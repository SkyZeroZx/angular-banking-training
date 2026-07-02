# Workshop 04 - Testing de Componentes, DOM Helpers y CVA

Esta rama nace desde `workshop/03-http-errors-analytics` y agrega la primera capa real de testing.

## Codigo agregado en esta sesion

- `element.spec-helper.ts`.
- `flush-macrotask.ts`.
- Specs de UI compartida.
- Specs de CVA: input, select y checkbox.
- Specs de selects remotos.
- Specs de directivas pequeñas: integer-only y scroll-end.

## Aun no existe en esta rama

- Tests de servicios HTTP.
- Tests de interceptores.
- RouterTestingHarness specs.
- Specs de pages/flows.

## Guion de 1h 30m

1. 0-15 min: unit vs component test en Angular.
2. 15-25 min: Act, Wait, Assert con `fixture.whenStable()`.
3. 25-40 min: helpers DOM por `data-testid`.
4. 40-58 min: CVA con host dummy.
5. 58-75 min: select custom con interacciones reales.
6. 75-90 min: ejercicio: agregar prueba de un control sin tocar internals.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
