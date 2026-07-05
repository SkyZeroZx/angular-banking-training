# Extra - Escenarios RouterTestingHarness

## Route params

Navegar a `/clientes/10/editar` y verificar que el componente carga id `10`.

## Query params

Navegar a `/search?q=angular` y verificar que el estado visible usa `q`.

## Redirect

Navegar a ruta protegida sin sesion y esperar render de login.

## Guard allowed

Configurar auth fake autenticado y esperar render de ruta protegida.

## Wildcard

Navegar a ruta inexistente y verificar redirect o not-found.

## Nested route

Navegar a parent/child y verificar que parent y child renderizan.

## Regla practica

No mockear `Router`. Usar `provideRouter` con rutas de test y `RouterTestingHarness`.
