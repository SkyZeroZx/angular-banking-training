# Workshop 04 - Testing de Componentes, DOM Helpers y CVA - Teoria y ejemplos

Esta sesion inicia testing Angular con componentes reales, template renderizado, helpers DOM y contratos CVA.

## Navegacion

- [Inicio local](README.md).
- [Temario y recorrido](WORKSHOP_STAGE.md).
- [Ejemplos guiados](WORKSHOP_EXAMPLES.md).

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
