# Workshop 04 - Ejemplos guiados

Estos ejemplos aterrizan testing de componentes, DOM helpers y CVA en specs reales.

## Ejemplo 1 - TestBed con componente real

Archivo base:

- `frontend/banking-front/src/app/shared/ui/button/button.component.spec.ts`

Punto a explicar:

```ts
await TestBed.configureTestingModule({
  imports: [ButtonComponent],
}).compileComponents();
```

En standalone components el componente se importa directamente. No hay `declarations`.

Mini ejercicio:

1. Abrir spec del button.
2. Ubicar `TestBed`.
3. Cambiar un input y correr solo ese spec.

## Ejemplo 2 - Testing por DOM

Archivos base:

- `frontend/banking-front/src/app/spec-helpers/element.spec-helper.ts`
- `frontend/banking-front/src/app/shared/ui/data-table/data-table.component.spec.ts`

Punto a explicar:

```ts
const rows = findAll(fixture, '[data-testid="table-row"]');
expect(rows.length).toBe(2);
```

El test valida comportamiento visible, no detalles privados del componente.

Mini ejercicio:

1. Cambiar fixture de filas.
2. Confirmar que el spec falla por DOM esperado.
3. Reparar expectativa sin leer propiedades privadas.

## Ejemplo 3 - Host dummy para CVA

Archivos base:

- `frontend/banking-front/src/app/shared/ui/form-field/input-field/input-field.component.spec.ts`
- `frontend/banking-front/src/app/shared/ui/form-field/select-field/select-field.component.spec.ts`
- `frontend/banking-front/src/app/shared/ui/form-field/checkbox-field/checkbox-field.component.spec.ts`

Punto a explicar:

```ts
@Component({
  imports: [ReactiveFormsModule, InputFieldComponent],
  template: `<app-input-field [formControl]="control" />`,
})
class HostComponent {
  readonly control = new FormControl('');
}
```

El host prueba el CVA desde la API publica de Angular Forms.

Mini ejercicio:

1. Setear valor desde `FormControl`.
2. Ver que el input DOM cambia.
3. Escribir en DOM y confirmar que el control recibe valor.

## Ejemplo 4 - Contrato CVA completo

Archivo base:

- `frontend/banking-front/src/app/shared/ui/form-field/input-field/input-field.component.spec.ts`

Checklist de contrato:

- `writeValue` pinta valor externo.
- `registerOnChange` propaga valor de usuario.
- `registerOnTouched` marca touched.
- `setDisabledState` bloquea interaccion.

Mini ejercicio:

1. Deshabilitar `FormControl`.
2. Confirmar atributo disabled.
3. Habilitar y probar escritura de usuario.

## Ejemplo 5 - Select remoto con doble de servicio

Archivos base:

- `frontend/banking-front/src/app/shared/components/client-select-field/client-select-field.component.spec.ts`
- `frontend/banking-front/src/app/spec-helpers/http.spec-helper.ts`

Punto a explicar:

```ts
const clientService = {
  getAll: jest.fn().mockReturnValue(of(pagedResponse([...]))),
};
```

El componente se prueba con un doble local. No se usa HTTP real en tests de componente.

Mini ejercicio:

1. Cambiar respuesta del doble.
2. Simular busqueda.
3. Confirmar opciones renderizadas.

## Ejemplo 6 - UI compartida

Archivos base:

- `frontend/banking-front/src/app/shared/ui/paginator/paginator.component.spec.ts`
- `frontend/banking-front/src/app/shared/ui/modal/components/modal.component.spec.ts`
- `frontend/banking-front/src/app/shared/ui/toast/toast.component.spec.ts`

Punto a explicar:

```ts
expect(nextButton.disabled).toBe(true);
```

UI compartida se testea por estados visibles y eventos emitidos, porque otros features dependen de ese contrato.

Mini ejercicio:

1. Cambiar pagina actual del paginator.
2. Ver botones habilitados/deshabilitados.
3. Confirmar evento emitido al click.
