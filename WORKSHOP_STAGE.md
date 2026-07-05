# Workshop 01 - Shell, Routing y Signals

Primer corte ejecutable: login, shell autenticado, clientes read-only y labs aislados de Angular moderno.

## Teoria

- Bootstrap standalone: `main.ts`, `app.ts`, `app.config.ts`.
- Routing moderno: `loadComponent`, guards funcionales y layout protegido.
- Estado local: `signal`, `computed`, `linkedSignal`, `toSignal`, `toObservable`.
- Change detection moderno: signals, `markForCheck`, `detectChanges` y pitfall zoneless.
- Routing extra: rutas hijas, redirect, wildcard local, resolver, query params y component input binding.

## Estructura

- `core/services/auth`, `core/services/client`, `core/guards/auth.guard.ts`.
- `pages/login`, `layout/content`, `pages/clients`.
- `pages/workshop/change-detection`.
- `pages/workshop/routing`.
- Sin CVA, sin UI compartida, sin reportes, sin testing avanzado.

## Practica

1. Ejecutar app y entender flujo login -> shell -> clientes.
2. Seguir rutas en `app.routes.ts`.
3. Leer estado reactivo en `clients.component.ts`.
4. Entrar a `/workshop/change-detection` y comparar signal, propiedad normal y `markForCheck`.
5. Entrar a `/workshop/routing` y revisar rutas hijas, resolver y wildcard.
6. Ejercicio: agregar una columna o filtro simple en clientes.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
