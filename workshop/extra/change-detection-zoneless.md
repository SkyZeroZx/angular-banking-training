# Extra - Change Detection y Zoneless

## Idea central

Change detection no es "Angular mira todo siempre". Es un mecanismo para sincronizar estado con DOM cuando Angular recibe una notificacion de cambio.

En Angular 21, zoneless es default. Por eso los ejemplos deben ensenar notificaciones explicitas:

- `signal.set()` o `signal.update()` si el template lee esa signal.
- evento de template como `(click)`.
- `ChangeDetectorRef.markForCheck()` si un callback externo cambia estado normal.
- `ChangeDetectorRef.detectChanges()` solo para chequeo local explicito.

## Error didactico buscado

En `/workshop/change-detection`, boton "Mutar sin notificar":

1. Agenda un `setTimeout`.
2. Cambia una propiedad normal.
3. No usa signal ni `markForCheck`.
4. La vista puede quedar vieja hasta otra notificacion.

Ese caso muestra por que zoneless empuja a estado explicito.

## Diferencia con ZoneJS

Con ZoneJS, muchos callbacks async disparaban change detection aunque no hubiera cambio relevante. Eso hacia la app comoda, pero tambien podia crear checks innecesarios y ocultar dependencias reales.

Con zoneless, hay menos magia. Si una libreria externa cambia algo importante, se avisa con signal, async pipe, input o `markForCheck`.

## Regla practica

Para codigo de aplicacion:

- Estado de UI local: signal.
- Estado derivado: computed.
- Evento de usuario: template listener.
- Callback externo: signal o `markForCheck`.
- Caso extremo local: `detectChanges`.
