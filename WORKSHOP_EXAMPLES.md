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

