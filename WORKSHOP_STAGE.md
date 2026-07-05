# Workshop 01 - Shell, Routing y Signals

Primer corte ejecutable: login, shell autenticado y clientes read-only con HTML simple.

## Teoria

- Bootstrap standalone: `main.ts`, `app.ts`, `app.config.ts`.
- Routing moderno: `loadComponent`, guards funcionales y layout protegido.
- Estado local: `signal`, `computed`, `linkedSignal`, `toSignal`, `toObservable`.
- Change detection moderno: ver [CHANGE_DETECTION_TEMARIO.md](CHANGE_DETECTION_TEMARIO.md).

## Estructura

- `core/services/auth`, `core/services/client`, `core/guards/auth.guard.ts`.
- `pages/login`, `layout/content`, `pages/clients`.
- Sin CVA, sin UI compartida, sin reportes, sin testing avanzado.

## Practica

1. Ejecutar app y entender flujo login -> shell -> clientes.
2. Seguir rutas en `app.routes.ts`.
3. Leer estado reactivo en `clients.component.ts`.
4. Ejercicio: agregar una columna o filtro simple en clientes.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
