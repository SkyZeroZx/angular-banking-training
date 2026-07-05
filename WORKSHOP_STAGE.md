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

## Recorrido

1. Diferencia estructural entre rama 03 y rama 04.
2. Helpers DOM: `element.spec-helper.ts` y `flush-macrotask.ts`.
3. Test de CVA con host dummy y `FormControl`.
4. Tests de selects remotos con doubles de servicio.
5. Tests de UI compartida: table, paginator, modal, dialog, toast.
6. Directivas pequenas con DOM real minimo.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
