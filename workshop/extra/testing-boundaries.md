# Extra - Boundaries de Testing

## Unit test

Usar cuando el comportamiento no necesita Angular DOM:

- mapper;
- service puro;
- validator;
- strategy;
- adapter.

## Component integration

Usar cuando importa template:

- CVA;
- output;
- render condicional;
- directiva;
- modal/dialog/toast.

## Router integration

Usar cuando importa navegacion:

- guard;
- route params;
- redirect;
- layout con outlet;
- page flow.

## E2E

Usar cuando importa stack completo:

- login real;
- backend real o entorno integrado;
- flujos criticos multi-pagina;
- compatibilidad de navegador.

## Regla practica

Elegir el test mas chico que pueda fallar por el bug real que quieres prevenir.
