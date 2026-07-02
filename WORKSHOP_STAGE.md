# Workshop 04 - Testing de Componentes, DOM Helpers y CVA

Esta rama nace desde `workshop/03-http-errors-analytics` y agrega la primera capa real de testing.

## Codigo agregado en esta sesion

- `element.spec-helper.ts`.
- `flush-macrotask.ts`.
- `http.spec-helper.ts` solo como soporte de `pagedResponse` para fixtures.
- Specs de UI compartida.
- Specs de CVA: input, select y checkbox.
- Specs de selects remotos.
- Specs de directivas pequeñas: integer-only y scroll-end.

## Aun no existe en esta rama

- Tests de servicios HTTP con `HttpTestingController`.
- Tests de interceptores.
- RouterTestingHarness specs.
- Specs de pages/flows.

## Guion de 1h 30m

1. 0-12 min: comparar rama 03 vs 04: aparece `spec-helpers` y specs de `shared`.
2. 12-24 min: `element.spec-helper.ts` y `flush-macrotask.ts`: queries por `data-testid`, `click`, `getText`, eventos y espera de macrotasks.
3. 24-38 min: `shared/ui/form-field/input-field/input-field.component.spec.ts`: CVA con host dummy y `FormControl`.
4. 38-52 min: `shared/ui/form-field/select-field/...spec.ts` y `checkbox-field/...spec.ts`: interacciones reales y estados disabled/touched.
5. 52-68 min: `client-select-field.component.spec.ts` y `account-select-field.component.spec.ts`: doubles de servicios y `pagedResponse`.
6. 68-82 min: `data-table.component.spec.ts`, `paginator.component.spec.ts`, `modal`, `dialog`, `toast` y `control-error`.
7. 82-90 min: ejercicio: agregar un spec de CVA sin leer propiedades privadas.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
