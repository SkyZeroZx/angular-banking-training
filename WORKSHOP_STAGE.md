# Workshop 02 - UI propia, CVA y Formularios

Segundo corte: la app pasa de HTML simple a UI reutilizable, formularios compuestos y rutas create/edit.

## Teoria

- UI propia: componentes chicos, inputs claros y contratos estables.
- CVA: `ControlValueAccessor` para integrar controles custom con Reactive Forms.
- Validacion reusable: `NG_VALIDATORS` cuando el componente expone reglas del formulario.
- Routing de edicion: `withComponentInputBinding()` para params como inputs.

## Estructura

- `shared/ui/button`, `icon`, `data-table`, `paginator`, `modal`, `dialog`, `toast`.
- `shared/ui/form-field/input-field`, `select-field`, `checkbox-field`.
- `pages/clients/components/client-form.component.ts`.
- `pages/accounts/components/account-form.component.ts`.
- `pages/movements/components/movement-form.component.ts`.
- `shared/components/base-paged-select.ts`, `client-select-field`, `account-select-field`.

## Recorrido

1. Diferencia estructural entre rama 01 y rama 02.
2. Contratos de UI en `DataTableComponent` y `PaginatorComponent`.
3. Campos CVA en `shared/ui/form-field`.
4. Formularios compuestos de clientes, cuentas y movimientos.
5. Selects remotos paginados y `base-paged-select.ts`.
6. Edicion con route input binding.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
