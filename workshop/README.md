# Workshop 04 - Teoria Angular Testing

Esta rama agrega la primera capa seria de tests: componentes compartidos, CVA, directivas pequenas y helpers DOM.

## Objetivo

Probar comportamiento visible y contratos publicos de componentes Angular sin acoplar tests a detalles privados.

## Temario de sesion

1. Diferencia entre unit test e integration test de componente.
2. `TestBed` como runtime Angular controlado.
3. Helpers DOM y `data-testid`.
4. Host dummy para CVA.
5. Contrato CVA: model -> view, view -> model, touched, disabled.
6. Specs de UI compartida por contrato publico.
7. Directivas pequenas con DOM real.
8. Criterios para evitar asserts de implementacion.

## 1. Unit test vs integration test de componente

Un componente Angular combina clase, template, bindings, inputs, outputs y DOM. Probar solo la clase puede servir para logica pura, pero no prueba que el usuario vea o pueda ejecutar algo.

En esta rama priorizamos integration tests livianos:

- `TestBed` crea componente real.
- Template renderiza.
- DOM recibe eventos.
- Assertions leen pantalla o outputs publicos.

## 2. Helpers DOM

`element.spec-helper.ts` existe para evitar repetir `querySelector`, casts y eventos manuales en cada spec.

El helper no debe esconder intencion. Debe hacer mas expresivo el test:

- buscar por `data-testid`;
- hacer `click`;
- leer texto;
- disparar input/change/blur.

## 3. Host dummy

Un CVA no se prueba bien instanciandolo como clase suelta. Necesita vivir dentro de un formulario real.

Host dummy permite probar:

- escritura desde `FormControl`;
- cambios desde UI;
- touched;
- disabled;
- validators.

## 4. CVA contract

El test debe cubrir contrato de Angular Forms:

- model -> view;
- view -> model;
- disabled;
- touched;
- errores visibles.

No debe leer propiedades privadas ni forzar metodos internos que el usuario nunca toca.

## 5. Specs de UI compartida

Componentes como `data-table`, `paginator`, `modal`, `dialog`, `toast` y `control-error` se prueban por contrato visual y eventos esperados.

Si un test sabe demasiado de estructura interna, el componente queda dificil de refactorizar.

## 6. Directivas pequenas

Directivas como integer-only o scroll-end se prueban con DOM real minimo. No necesitan page completa ni Cypress.

## Material extra

- [Matriz de tests CVA](extra/cva-test-matrix.md)
- [Patron de helpers DOM](extra/dom-helper-pattern.md)

## Fuentes oficiales

- Basics of testing components: https://angular.dev/guide/testing/components-basics
- Component testing scenarios: https://angular.dev/guide/testing/components-scenarios
- Testing utility APIs: https://angular.dev/guide/testing/utility-apis
- Component harnesses overview: https://angular.dev/guide/testing/component-harnesses-overview
- `ControlValueAccessor`: https://angular.dev/api/forms/ControlValueAccessor
