# Extra - HttpContext y opt-out

## Problema

Un interceptor global aplica reglas a todos los requests. A veces un flujo necesita evitar una regla concreta.

Mala salida:

- Revisar URLs dentro del interceptor.
- Meter flags en query params.
- Duplicar cliente HTTP.

Mejor salida:

- `HttpContextToken`.
- Request opt-out explicito.
- Interceptor lee token y decide.

## En esta rama

`SKIP_ERROR_INTERCEPTOR` permite saltar el manejo global de errores.

Esto mantiene el protocolo cerca de Angular HTTP y evita acoplarlo a detalles de URL.

## Regla practica

Usar `HttpContext` cuando la decision pertenece al request, no al backend.

Ejemplos:

- Saltar toast global.
- Activar cache local.
- Marcar request silencioso.
- Adjuntar metadata de tracing.
