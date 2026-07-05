# Extra - Matriz de Tests CVA

## Casos obligatorios

| Caso         | Que valida                         |
| ------------ | ---------------------------------- |
| `writeValue` | Form model actualiza UI            |
| User input   | UI actualiza FormControl           |
| Blur/touch   | Control queda touched              |
| Disabled     | UI bloquea interaccion             |
| Validation   | Error aparece por contrato publico |

## Anti-patrones

- Llamar directamente metodos privados.
- Leer signals privadas.
- Verificar clases CSS internas si hay texto/ARIA/estado publico mejor.
- Mockear Angular Forms.

## Recomendacion

Usar host dummy con `FormControl`. El test debe parecerse a como el componente se usa en la app.
