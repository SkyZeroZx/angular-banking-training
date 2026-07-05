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

## Workshop 04 - Testing de Componentes, DOM Helpers y CVA

Esta sesion inicia testing Angular con componentes reales, template renderizado, helpers DOM y contratos CVA.

## Temario

1. Unit test vs integration test de componente.
2. `TestBed` como runtime Angular controlado.
3. Helpers DOM y queries por `data-testid`.
4. Host dummy para controles CVA.
5. Contrato CVA: model -> view, view -> model, touched, disabled.
6. Specs de UI compartida por contrato publico.
7. Directivas pequenas con DOM real minimo.

## Teoria Angular Testing

### TestBed y componente real

`TestBed` crea un entorno Angular de test. Permite renderizar template, aplicar bindings, disparar eventos y ejecutar change detection.

Ejemplo minimo:

```ts
await TestBed.configureTestingModule({
  imports: [InputFieldComponent, ReactiveFormsModule],
}).compileComponents();

const fixture = TestBed.createComponent(InputFieldComponent);
fixture.detectChanges();
```

### Testing por DOM

Un test de componente debe observar comportamiento visible: texto, estado disabled, eventos de usuario y salida publica. Los helpers DOM reducen ruido de `querySelector`.

Ejemplo minimo:

```ts
const input = getByTestId<HTMLInputElement>(fixture, "name-input");
setInputValue(input, "Ana");
fixture.detectChanges();

expect(input.value).toBe("Ana");
```

### Host dummy para CVA

Un CVA se entiende mejor dentro de un formulario real. Host dummy prueba integracion con `FormControl`, no metodos internos.

Ejemplo minimo:

```ts
@Component({
  imports: [ReactiveFormsModule, InputFieldComponent],
  template: `<app-input-field [formControl]="control" />`,
})
class HostComponent {
  control = new FormControl("Inicial");
}
```

### Contrato CVA

El contrato relevante es:

- `writeValue`: model -> view.
- cambio de usuario: view -> model.
- blur o interaccion equivalente: touched.
- `setDisabledState`: disabled visible.
- validators: errores publicos.

### UI compartida

Componentes como table, paginator, modal, dialog y toast se prueban por inputs, outputs y DOM visible. Un test no debe depender de propiedades privadas ni estructura incidental.

Ejemplo minimo:

```ts
fixture.componentRef.setInput("page", 2);
click(getByTestId(fixture, "next-page"));

expect(fixture.componentInstance.pageChange.emit).toHaveBeenCalledWith(3);
```

## Documentacion oficial

- Component testing basics: https://angular.dev/guide/testing/components-basics
- Component scenarios: https://angular.dev/guide/testing/components-scenarios
- Testing utility APIs: https://angular.dev/guide/testing/utility-apis
- Component harnesses: https://angular.dev/guide/testing/component-harnesses-overview
- `ControlValueAccessor`: https://angular.dev/api/forms/ControlValueAccessor
