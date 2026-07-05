# Workshop 01 - Teoria Angular

Esta rama presenta la base moderna de Angular antes de agregar UI propia, formularios avanzados o testing profundo.

## Objetivo

Construir un primer corte navegable: login, shell autenticado, listado read-only de clientes y dos labs aislados para explicar change detection y routing.

## Temario de sesion

1. Contexto del dominio y flujo local.
2. Bootstrap standalone: `main.ts`, `app.ts`, `app.config.ts`.
3. Router principal: `loadComponent`, children, guards y wildcard.
4. Shell autenticado: layout, sidebar y `router-outlet`.
5. Estado local de clientes: signals, RxJS interop y carga HTTP.
6. Lab de change detection: zoneless, signals, `markForCheck`, `detectChanges`.
7. Lab de routing: rutas hijas, resolver, query params, wildcard local y `routerOutletData`.
8. Cierre: criterios para mantener labs aislados del dominio.

## 1. Bootstrap standalone

Angular moderno no necesita `AppModule` para arrancar una aplicacion. El punto de entrada vive en `main.ts`, el componente raiz en `app.ts` y los providers globales en `app.config.ts`.

En esta rama, `app.config.ts` registra:

- `provideRouter(appRoutes, withComponentInputBinding())`.
- `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`.

Este corte muestra una app standalone pequena: primero login, luego shell protegido, luego paginas lazy.

## 2. Routing base

El router trabaja con una lista ordenada de rutas. Angular usa first-match wins: una ruta mas especifica debe ir antes de una mas amplia, y el wildcard `**` debe quedar al final.

En esta rama:

- `/login` es ruta publica y usa `publicGuard`.
- `/` carga el layout autenticado y usa `authGuard`.
- `/clientes` vive como ruta hija del layout.
- `**` redirige al flujo principal.

La carga se hace con `loadComponent`, asi cada pagina puede partir en un chunk propio sin crear modulos de feature.

## 3. Guards funcionales

Los guards funcionales usan `inject()` y devuelven `true`, `false`, `UrlTree`, `Promise` u `Observable`. Sirven para UX y navegacion, no reemplazan seguridad backend.

En esta rama:

- `authGuard` protege el shell.
- `publicGuard` evita volver al login cuando ya existe sesion.

## 4. Signals y estado local

Signals modelan estado explicito. Un `signal()` guarda valor mutable, un `computed()` deriva valor, y `linkedSignal()` permite estado writable que se reinicia cuando cambia una fuente.

En `ClientsComponent` se combina:

- `toSignal()` para leer `valueChanges` de Reactive Forms.
- `linkedSignal()` para resetear pagina cuando cambia busqueda.
- `computed()` para crear trigger de carga.
- `toObservable()` para conectar signals con RxJS y servicios HTTP.

## 5. Change detection y zoneless

Angular 21 usa zoneless por defecto. Antes, ZoneJS observaba timers, eventos, XHR y otras tareas async para disparar change detection. Ese modelo era comodo, pero podia ocultar dependencias y disparar checks innecesarios.

Con zoneless, Angular espera notificaciones claras. Casos comunes:

- signal leida en template cambia.
- listener de template o host corre.
- `ChangeDetectorRef.markForCheck()` marca vista para chequeo.
- `ComponentRef.setInput()` actualiza input.

El lab `/workshop/change-detection` muestra tres casos:

- Signal: actualiza UI porque Angular ve la dependencia.
- Propiedad normal en `setTimeout`: cambia el dato, pero no notifica.
- Propiedad normal + `markForCheck`: cambia el dato y avisa a Angular.

`detectChanges()` tambien aparece, pero como herramienta local y explicita. No debe ser reflejo automatico ante cualquier problema de estado.

## 6. Zone pollution legacy

En apps con ZoneJS, tareas como `setInterval`, `requestAnimationFrame` o librerias de terceros podian disparar change detection aunque no cambiaran UI. Eso se conoce como zone pollution.

En zoneless el problema cambia: ya no dependes de ZoneJS para enterarte de todo. El codigo debe notificar estado relevante con signals, async pipe, inputs o `markForCheck`.

## 7. Routing avanzado minimo

El lab `/workshop/routing` muestra conceptos que conviene conocer temprano:

- Rutas hijas con `<router-outlet />` dentro de una pagina padre.
- Redirect local de `workshop/routing` a `overview`.
- Wildcard local para rutas desconocidas dentro del lab.
- Query params con `[queryParams]`.
- Resolver con `ResolveFn` antes de activar la ruta.
- `withComponentInputBinding()` para recibir params, query params, route data y resolved data como `input()`.
- `routerOutletData` para pasar contexto desde outlet padre a componente hijo.

Este lab no reemplaza el flujo real de la app; existe para que el instructor pueda abrir el codigo y explicar router sin meter deuda en clientes.

## Material extra

- [Change detection y zoneless](extra/change-detection-zoneless.md)
- [Routing lab](extra/routing-lab.md)

## Fuentes oficiales

- Runtime performance: https://angular.dev/best-practices/runtime-performance
- Zoneless: https://angular.dev/guide/zoneless
- `provideZonelessChangeDetection`: https://angular.dev/api/core/provideZonelessChangeDetection
- `ChangeDetectionStrategy`: https://angular.dev/api/core/ChangeDetectionStrategy
- `ChangeDetectorRef`: https://angular.dev/api/core/ChangeDetectorRef
- Routing common tasks: https://angular.dev/guide/routing/common-router-tasks
- Data resolvers: https://angular.dev/guide/routing/data-resolvers
