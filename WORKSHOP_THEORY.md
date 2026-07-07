# Workshop 02 - UI propia, CVA y Formularios - Teoria y ejemplos

Esta sesion convierte pantallas simples en una aplicacion con UI reusable, formularios compuestos, controles custom y rutas create/edit.

## Navegacion

- [Inicio local](README.md).
- [Temario y recorrido](WORKSHOP_STAGE.md).
- [Ejemplos guiados](WORKSHOP_EXAMPLES.md).

## Teoria Angular

### Componentes UI como contrato

Un componente de UI compartida debe ser pequeno y explicito. No conoce el dominio; recibe datos, estado y callbacks. Asi puede vivir en `shared/ui` sin acoplarse a clientes, cuentas o movimientos.

Ejemplo minimo:

```html
<app-data-table [rows]="clients()" [columns]="clientColumns" />
<app-paginator
  [page]="page()"
  [total]="total()"
  (pageChange)="page.set($event)"
/>
```

### ControlValueAccessor

`ControlValueAccessor` conecta un control custom con Angular Forms. El formulario escribe valor hacia el componente con `writeValue`; el componente informa cambios con `registerOnChange`.

Ejemplo minimo:

```ts
export class InputFieldComponent implements ControlValueAccessor {
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? "");
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
```

### Validadores custom

Si el control conoce una regla local, puede exponer `NG_VALIDATORS`. Si la regla involucra varias piezas del dominio, pertenece al formulario padre.

Ejemplo minimo:

```ts
{
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => AccountSelectFieldComponent),
  multi: true,
}
```

### Formularios compuestos

Un formulario compuesto agrupa campos de una feature y expone un contrato de valor. No intenta ser un formulario universal; conserva ownership del dominio.

Ejemplo minimo:

```html
<app-account-form [formControl]="accountControl" [mode]="mode()" />
```

### Selects remotos paginados

Una clase base puede concentrar mecanica repetida: busqueda, pagina, carga y seleccion. Cada select concreto mantiene servicio y tipo propio.

Ejemplo minimo:

```ts
export class ClientSelectFieldComponent extends BasePagedSelectComponent<Client> {
  protected override loadPage(query: PageQuery) {
    return this.clientService.getAll(query);
  }
}
```

### Route input binding

`withComponentInputBinding()` permite recibir params de ruta como `input()`. Esto reduce lectura manual de `ActivatedRoute`.

Ejemplo minimo:

```ts
export class AccountEditComponent {
  readonly id = input.required<string>();
}
```

## Documentacion oficial

- Components: https://angular.dev/guide/components
- Inputs: https://angular.dev/guide/components/inputs
- Forms overview: https://angular.dev/guide/forms
- `ControlValueAccessor`: https://angular.dev/api/forms/ControlValueAccessor
- Form validation: https://angular.dev/guide/forms/form-validation
- Routing common tasks: https://angular.dev/guide/routing/common-router-tasks
