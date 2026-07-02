# Workshop 02 - UI propia, CVA y Formularios

Esta rama nace desde `workshop/01-shell-routing-signals` y agrega el segundo bloque real de construccion.

## Codigo agregado en esta sesion

- UI compartida: button, icon, data table, paginator, modal, dialog, toast y control errors.
- Controles CVA: input, select y checkbox.
- Formularios compuestos: cliente, cuenta y movimiento.
- Selects remotos paginados: cliente y cuenta.
- Rutas de crear/editar clientes, cuentas y movimientos.
- Servicios de cuenta y movimiento.
- `withComponentInputBinding()` para rutas de edicion.

## Aun no existe en esta rama

- Reportes.
- Error interceptor.
- Global error handler.
- Analytics/click tracking.
- Specs avanzados; solo queda smoke test de app.

## Guion de 1h 30m

1. 0-10 min: comparar rama 01 vs 02: ahora aparecen `shared/ui`, rutas de create/edit y nuevas paginas.
2. 10-24 min: `shared/ui/button`, `shared/ui/icon`, `shared/ui/data-table` y `shared/ui/paginator`: contratos chicos de UI.
3. 24-42 min: `shared/ui/form-field/input-field`, `select-field` y `checkbox-field`: CVA y errores de formulario.
4. 42-58 min: `ClientFormComponent`, `AccountFormComponent` y `MovementFormComponent`: formularios compuestos con `NG_VALUE_ACCESSOR` y `NG_VALIDATORS`.
5. 58-72 min: `shared/components/base-paged-select.ts`, `ClientSelectFieldComponent` y `AccountSelectFieldComponent`: selects remotos paginados.
6. 72-82 min: `withComponentInputBinding()` en rutas de edicion de clientes/cuentas.
7. 82-90 min: ejercicio: agregar un campo nuevo en `AccountFormComponent` y consumirlo desde create/edit.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
