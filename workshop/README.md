# Workshop 02 - Teoria Angular

Esta rama toma la base navegable de la rama 01 y agrega UI reusable, formularios compuestos, CVA y flujos create/edit.

## Objetivo

Convertir pantallas HTML simples en una app con contratos UI propios y formularios que se integran con Reactive Forms sin duplicar logica.

## 1. UI propia como contrato

Una UI compartida no deberia ser un conjunto de estilos sueltos. Cada componente debe tener un contrato pequeno:

- Inputs que describen estado.
- Outputs para eventos relevantes.
- Slots o directivas cuando el contenido necesita flexibilidad.
- Estilos encapsulados y predecibles.

En esta rama aparecen `button`, `icon`, `data-table`, `paginator`, `modal`, `dialog`, `toast` y `control-error`.

## 2. Data table y paginator

`DataTableComponent` y `PaginatorComponent` separan contrato visual de logica de negocio. La tabla no sabe de clientes, cuentas o movimientos; solo recibe columnas, filas o plantillas.

Esto permite que el dominio cambie sin reescribir comportamiento transversal.

## 3. CVA

`ControlValueAccessor` es el puente entre un componente custom y Angular Forms. El contrato minimo es:

- `writeValue`: model -> view.
- `registerOnChange`: view -> model.
- `registerOnTouched`: touched/blur.
- `setDisabledState`: estado disabled desde el form.

En esta rama los campos custom viven en `shared/ui/form-field`.

## 4. Validacion reusable

Cuando un componente de formulario tambien conoce reglas propias, puede exponer `NG_VALIDATORS`. Esto evita que cada consumidor copie validaciones internas.

Regla: validacion local del control dentro del control; validacion de negocio del formulario en el formulario.

## 5. Formularios compuestos

`ClientFormComponent`, `AccountFormComponent` y `MovementFormComponent` agrupan campos y exponen un contrato de valor. Sirven para reuse entre create/edit sin crear un componente omnipotente.

La idea no es hacer un mega form generico. La idea es que cada feature tenga un formulario claro, reusable y con ownership propio.

## 6. Selects remotos paginados

`base-paged-select.ts` concentra mecanica comun: busqueda, pagina, carga y seleccion. Los selects concretos (`client-select-field`, `account-select-field`) definen servicio y tipo real.

Esto reduce duplicidad sin esconder el dominio.

## 7. Route input binding

`withComponentInputBinding()` permite que params de ruta lleguen como inputs. En edit screens, esto reduce dependencia directa de `ActivatedRoute` y hace los componentes mas faciles de probar.

## Material extra

- [Checklist CVA](extra/cva-checklist.md)
- [Boundaries de UI compartida](extra/ui-boundaries.md)

## Fuentes oficiales

- Forms overview: https://angular.dev/guide/forms
- `ControlValueAccessor`: https://angular.dev/api/forms/ControlValueAccessor
- Missing value accessor: https://angular.dev/errors/NG01203
- Routing common tasks: https://angular.dev/guide/routing/common-router-tasks
