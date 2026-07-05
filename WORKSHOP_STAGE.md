# Workshop 04 - Testing de Componentes, DOM Helpers y CVA

Primer corte de testing: componentes compartidos, CVA y directivas pequenas.

## Teoria

- Unit test Angular: probar contrato publico, no propiedades privadas.
- Integration test de componente: `TestBed`, template real, DOM events y host dummy.
- CVA contract: `writeValue`, `registerOnChange`, disabled, touched y validators.
- Helpers propios: menos repeticion, queries por `data-testid`, eventos claros.

## Estructura

- `spec-helpers/element.spec-helper.ts`.
- `spec-helpers/flush-macrotask.ts`.
- `spec-helpers/http.spec-helper.ts` solo para fixtures `pagedResponse`.
- Specs de `shared/ui/form-field`.
- Specs de `client-select-field` y `account-select-field`.
- Specs de `data-table`, `paginator`, `modal`, `dialog`, `toast`, `control-error`.

## Practica

1. Comparar rama 03 vs 04.
2. Leer `element.spec-helper.ts` y usarlo en un spec existente.
3. Revisar un CVA con host dummy.
4. Ejercicio: agregar un caso disabled/touched sin leer estado privado.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
