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

1. 0-10 min: comparar rama 01 vs 02 y ver que ahora aparece una UI propia.
2. 10-30 min: `InputFieldComponent` como CVA.
3. 30-45 min: `SelectFieldComponent`, busqueda y teclado.
4. 45-60 min: formularios compuestos con `NG_VALUE_ACCESSOR` y `NG_VALIDATORS`.
5. 60-72 min: selects paginados con `BasePagedSelectComponent`.
6. 72-82 min: tabla/paginador con templates.
7. 82-90 min: ejercicio: agregar un campo nuevo al formulario.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
