# Extra - Patron de Helpers DOM

## Objetivo

Los helpers DOM eliminan repeticion accidental, no reemplazan el criterio del test.

## Buen helper

- Tiene nombre claro.
- Devuelve tipo especifico.
- Falla con mensaje util cuando no encuentra elemento.
- Usa `data-testid` para elementos relevantes.
- No conoce detalles de negocio.

## Mal helper

- Hace demasiadas acciones en una llamada.
- Oculta asserts.
- Depende de CSS interno.
- Mezcla setup de providers con queries DOM.

## Regla practica

Si el helper hace que el test se lea como una accion de usuario, aporta. Si esconde el comportamiento que estas probando, sobra.
