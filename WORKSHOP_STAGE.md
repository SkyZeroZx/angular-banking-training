# Workshop 02 - UI propia, CVA y Formularios

Segundo corte: la app pasa de HTML simple a UI reutilizable, formularios compuestos y rutas create/edit.

## Teoria

- [Componentes UI como contrato](README.md#componentes-ui-como-contrato).
- [ControlValueAccessor](README.md#controlvalueaccessor).
- [Validadores custom](README.md#validadores-custom).
- [Formularios compuestos](README.md#formularios-compuestos).
- [Selects remotos paginados](README.md#selects-remotos-paginados).
- [Route input binding](README.md#route-input-binding).

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

## Ampliacion oficial

- https://angular.dev/guide/components
- https://angular.dev/guide/forms
- https://angular.dev/api/forms/ControlValueAccessor
- https://angular.dev/guide/routing/common-router-tasks

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
