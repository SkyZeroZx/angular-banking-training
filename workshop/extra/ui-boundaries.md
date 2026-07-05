# Extra - Boundaries de UI compartida

## Que si va en `shared/ui`

- Componentes visuales sin dominio.
- Contratos reutilizables: button, table, paginator, dialog, toast.
- Estados transversales: loading, disabled, empty, error visual.

## Que no va en `shared/ui`

- Reglas de negocio.
- DTOs del backend.
- Servicios de feature.
- Decisiones de flujo create/edit.

## Regla practica

Si el componente necesita saber que es un cliente, cuenta o movimiento, no es UI generica. Debe vivir en la feature.

Si el componente solo necesita label, estado, valor, columnas o callbacks, puede vivir en UI compartida.

## Por que importa

UI compartida mal ubicada se vuelve rigida. Un cambio pequeno en una feature rompe otras pantallas. La abstraccion debe aparecer cuando reduce duplicidad real, no por anticipacion.
