# Workshop 01 - Shell, Routing y Signals

Primer corte ejecutable: login, shell autenticado, clientes read-only y labs aislados de Angular moderno.

## Teoria

- [Bootstrap standalone](README.md#bootstrap-standalone): `main.ts`, `app.ts`, `app.config.ts`.
- [Routing lazy](README.md#routing-lazy): `loadComponent`, guards funcionales y layout protegido.
- [Signals y RxJS interop](README.md#signals-y-rxjs-interop): `signal`, `computed`, `linkedSignal`, `toSignal`, `toObservable`.
- [Change detection zoneless](README.md#change-detection-zoneless): signals, `markForCheck`, `detectChanges`.
- [Router avanzado del lab](README.md#router-avanzado-del-lab): rutas hijas, resolver, wildcard y component input binding.

## Estructura

- `core/services/auth`, `core/services/client`, `core/guards/auth.guard.ts`.
- `pages/login`, `layout/content`, `pages/clients`.
- `app/workshop/change-detection`.
- `app/workshop/routing`.

## Recorrido

1. Arranque local y flujo login -> shell -> clientes.
2. Bootstrap standalone en `main.ts`, `app.ts` y `app.config.ts`.
3. Rutas lazy, guards funcionales y layout protegido en `app.routes.ts`.
4. Estado reactivo local en `clients.component.ts`.
5. Lab `/workshop/change-detection`: signal, propiedad normal y `markForCheck`.
6. Lab `/workshop/routing`: rutas hijas, resolver, wildcard y component input binding.

## Ampliacion oficial

- https://angular.dev/guide/components
- https://angular.dev/guide/signals
- https://angular.dev/guide/zoneless
- https://angular.dev/guide/routing

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```
