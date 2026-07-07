# Workshop 02 - Ejemplos guiados

Estos ejemplos aterrizan UI propia, CVA y formularios en archivos reales de esta rama.

## Ejemplo 1 - UI como contrato

Archivos base:

- `frontend/banking-front/src/app/shared/ui/data-table/data-table.component.ts`
- `frontend/banking-front/src/app/shared/ui/paginator/paginator.component.ts`
- `frontend/banking-front/src/app/pages/clients/clients.component.ts`

Punto a explicar:

```ts
readonly columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'identificacion', label: 'Identificacion' },
];
```

La pagina entrega datos y metadata. `DataTableComponent` no conoce el dominio bancario.

Mini ejercicio:

1. Agregar una columna al arreglo de clientes.
2. Confirmar que no se modifica el componente de tabla.
3. Explicar diferencia entre componente de dominio y componente UI.

## Ejemplo 2 - ControlValueAccessor

Archivos base:

- `frontend/banking-front/src/app/shared/ui/form-field/input-field/input-field.component.ts`
- `frontend/banking-front/src/app/shared/ui/form-field/select-field/select-field.component.ts`
- `frontend/banking-front/src/app/shared/ui/form-field/checkbox-field/checkbox-field.component.ts`

Punto a explicar:

```ts
writeValue(value: string | null): void {
  this.value.set(value ?? '');
}

registerOnChange(fn: (value: string) => void): void {
  this.onChange = fn;
}
```

El CVA traduce eventos DOM a API de Angular Forms. El formulario padre solo ve `formControlName`.

Mini ejercicio:

1. Abrir formulario de clientes.
2. Cambiar un input.
3. Seguir el flujo: DOM -> CVA -> `FormControl` -> validacion.

## Ejemplo 3 - Validadores custom

Archivos base:

- `frontend/banking-front/src/app/core/types/form.types.ts`
- `frontend/banking-front/src/app/pages/clients/components/client-form.component.ts`
- `frontend/banking-front/src/app/pages/accounts/components/account-form.component.ts`

Punto a explicar:

```ts
readonly form = this.fb.nonNullable.group({
  identificacion: ['', [Validators.required, Validators.maxLength(20)]],
});
```

Los validadores viven en el borde del formulario. La UI muestra errores sin duplicar reglas.

Mini ejercicio:

1. Vaciar identificacion.
2. Ver `control-error`.
3. Agregar un valor demasiado largo y revisar mensaje.

## Ejemplo 4 - Formularios compuestos

Archivos base:

- `frontend/banking-front/src/app/pages/clients/components/client-form.component.ts`
- `frontend/banking-front/src/app/pages/accounts/components/account-form.component.ts`
- `frontend/banking-front/src/app/pages/movements/components/movement-form.component.ts`

Punto a explicar:

```ts
@Output() readonly submitted = new EventEmitter<ClientRequest>();
```

El form component no decide si crea o actualiza. Emite un contrato y la pagina orquesta.

Mini ejercicio:

1. Comparar create y edit de clientes.
2. Ver que ambos reutilizan el mismo form.
3. Identificar donde se llama al servicio HTTP.

## Ejemplo 5 - Select remoto paginado

Archivos base:

- `frontend/banking-front/src/app/shared/components/base-paged-select.ts`
- `frontend/banking-front/src/app/shared/components/client-select-field/client-select-field.component.ts`
- `frontend/banking-front/src/app/shared/components/account-select-field/account-select-field.component.ts`

Punto a explicar:

```ts
protected abstract loadPage(params: PageParams): Observable<PagedResponse<T>>;
```

`BasePagedSelect` contiene paginacion/busqueda. Cada select implementa carga y etiqueta.

Mini ejercicio:

1. Abrir form de cuenta.
2. Buscar cliente por nombre.
3. Explicar como la clase base evita duplicar paginacion.

## Ejemplo 6 - Route input binding

Archivos base:

- `frontend/banking-front/src/app/pages/clients/edit/client-edit.component.ts`
- `frontend/banking-front/src/app/pages/accounts/edit/account-edit.component.ts`
- `frontend/banking-front/src/app/app.routes.ts`

Punto a explicar:

```ts
readonly clienteId = input.required<string>();
```

La ruta entrega params como inputs del componente. El componente no necesita inyectar `ActivatedRoute`.

Mini ejercicio:

1. Navegar a editar cliente.
2. Cambiar `clienteId` en la URL.
3. Ver que el input alimenta la carga del detalle.
