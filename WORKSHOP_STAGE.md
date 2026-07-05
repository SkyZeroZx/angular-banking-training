# Workshop 04 - Testing de Componentes, DOM Helpers y CVA

Primer corte de testing: componentes compartidos, CVA y directivas pequenas.

## Teoria

- [TestBed y componente real](README.md#testbed-y-componente-real).
- [Testing por DOM](README.md#testing-por-dom).
- [Host dummy para CVA](README.md#host-dummy-para-cva).
- [Contrato CVA](README.md#contrato-cva).
- [UI compartida](README.md#ui-compartida).

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

## Ampliacion oficial

- https://angular.dev/guide/testing/components-basics
- https://angular.dev/guide/testing/components-scenarios
- https://angular.dev/guide/testing/utility-apis
- https://angular.dev/api/forms/ControlValueAccessor

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
