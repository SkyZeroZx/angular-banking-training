# Angular Banking Training

Repositorio full-stack para capacitacion Angular. Cada rama `workshop/*` es un snapshot incremental y ejecutable.

## Rama Actual

Lee [WORKSHOP_STAGE.md](WORKSHOP_STAGE.md) para ver como dictar esta sesion y donde ampliar cada tema en la documentacion oficial.

## Ramas

| Rama                                     | Sesion    | Incremento real                                        |
| ---------------------------------------- | --------- | ------------------------------------------------------ |
| `workshop/01-shell-routing-signals`      | Angular 1 | Shell, login, rutas lazy, guards, clientes con signals |
| `workshop/02-ui-cva-forms`               | Angular 2 | UI propia, CVA, formularios, cuentas y movimientos     |
| `workshop/03-http-errors-analytics`      | Angular 3 | Reportes, interceptores, error global, analytics       |
| `workshop/04-testing-components-cva`     | Testing 1 | Helpers DOM, component tests, CVA tests                |
| `workshop/05-testing-http-interceptors`  | Testing 2 | HttpTestingController, servicios, interceptores        |
| `workshop/06-testing-router-integration` | Testing 3 | RouterTestingHarness, guards, flows de paginas         |

## Ejecucion Local

Backend local con H2:

```bash
cd backend
mvn -pl auth-service spring-boot:run
```

```bash
cd backend
mvn -pl banking-service spring-boot:run
```

```bash
cd backend
mvn -pl api-gateway spring-boot:run
```

Frontend:

```bash
cd frontend/banking-front
npm ci
npm start
```

Login local:

| Usuario | Password   |
| ------- | ---------- |
| `admin` | `admin123` |

## Validacion

Frontend:

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```

Backend:

```bash
cd backend
mvn test
```

## Servicios

| Servicio        | URL                                |
| --------------- | ---------------------------------- |
| API Gateway     | `http://localhost:8080`            |
| Banking Service | `http://localhost:8090`            |
| Auth Service    | `http://localhost:8091`            |
| H2 Auth         | `http://localhost:8091/h2-console` |
| H2 Banking      | `http://localhost:8090/h2-console` |

H2 usa usuario `sa` y password vacio.

## Workshop 02 - UI propia, CVA y Formularios

Esta sesion convierte pantallas simples en una aplicacion con UI reusable, formularios compuestos, controles custom y rutas create/edit.

## Temario

1. UI propia como contrato: inputs, outputs, estado visual y contenido.
2. `DataTableComponent` y `PaginatorComponent` como contratos de lectura.
3. CVA: integracion entre componentes custom y Angular Forms.
4. Validacion reusable con `NG_VALIDATORS`.
5. Formularios compuestos por feature.
6. Selects remotos paginados con abstraccion base.
7. Rutas de create/edit y `withComponentInputBinding()`.

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
