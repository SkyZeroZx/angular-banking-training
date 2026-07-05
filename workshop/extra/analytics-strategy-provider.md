# Extra - Analytics Strategy Provider

## Problema

Analytics suele crecer mal:

- Componentes llaman SDK concreto.
- Tests mockean globals.
- Cambiar vendor rompe muchas pantallas.

## Patron

Separar contrato de implementacion:

- Adapter: API que usa la app.
- Strategy: destino concreto.
- Provider: composicion de strategies.
- Directive: eventos declarativos en template.

## Beneficio

- Tree-shaking mas claro.
- Tests con doubles pequenos.
- Nuevos destinos sin tocar componentes.
- Menos acoplamiento a `window`, `gtag` u otro SDK.

## Regla practica

El componente dice "ocurrio evento". La strategy decide "a donde se envia".
