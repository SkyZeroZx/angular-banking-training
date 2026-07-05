# Angular Banking Training

Repositorio full-stack para capacitacion Angular. Cada rama `workshop/*` es un snapshot incremental y ejecutable.

## Rama Actual

Lee [WORKSHOP_STAGE.md](WORKSHOP_STAGE.md) para ver el corte ejecutable de esta rama.

Esta rama 01 incluye dos labs didacticos aislados. No son parte del dominio bancario; existen para explicar Angular moderno antes de construir features mas grandes.

- `/workshop/change-detection`: signals, zoneless, mutaciones asincronas, `markForCheck` y `detectChanges`.
- `/workshop/routing`: rutas hijas, redirect, wildcard local, resolver, query params, `routerOutletData` y `withComponentInputBinding()`.

## Ramas

| Rama                                     | Sesion    | Incremento real                                        |
| ---------------------------------------- | --------- | ------------------------------------------------------ |
| `workshop/01-shell-routing-signals`      | Angular 1 | Shell, login, rutas lazy, guards, clientes con signals |
| `workshop/02-ui-cva-forms`               | Angular 2 | UI propia, CVA, formularios, cuentas y movimientos     |
| `workshop/03-http-errors-analytics`      | Angular 3 | Reportes, interceptores, error global, analytics       |
| `workshop/04-testing-components-cva`     | Testing 1 | Helpers DOM, component tests, CVA tests                |
| `workshop/05-testing-http-interceptors`  | Testing 2 | HttpTestingController, servicios, interceptores        |
| `workshop/06-testing-router-integration` | Testing 3 | RouterTestingHarness, guards, flows de paginas         |

## Ejecucion Local

Backend local con H2:

```bash
cd backend
mvn -pl auth-service spring-boot:run
```

```bash
cd backend
mvn -pl banking-service spring-boot:run
```

```bash
cd backend
mvn -pl api-gateway spring-boot:run
```

Frontend:

```bash
cd frontend/banking-front
npm ci
npm start
```

Login local:

| Usuario | Password   |
| ------- | ---------- |
| `admin` | `admin123` |

## Validacion

Frontend:

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```

Backend:

```bash
cd backend
mvn test
```

## Servicios

| Servicio        | URL                                |
| --------------- | ---------------------------------- |
| API Gateway     | `http://localhost:8080`            |
| Banking Service | `http://localhost:8090`            |
| Auth Service    | `http://localhost:8091`            |
| H2 Auth         | `http://localhost:8091/h2-console` |
| H2 Banking      | `http://localhost:8090/h2-console` |

H2 usa usuario `sa` y password vacio.

## Workshop 01 - Teoria Angular

### 1. Bootstrap standalone

Angular moderno no necesita `AppModule` para arrancar una aplicacion. El punto de entrada vive en `main.ts`, el componente raiz en `app.ts` y los providers globales en `app.config.ts`.

En esta rama, `app.config.ts` registra:

- `provideRouter(appRoutes, withComponentInputBinding())`.
- `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`.

Este corte muestra una app standalone pequena: primero login, luego shell protegido, luego paginas lazy.

### 2. Routing base

El router trabaja con una lista ordenada de rutas. Angular usa first-match wins: una ruta mas especifica debe ir antes de una mas amplia, y el wildcard `**` debe quedar al final.

En esta rama:

- `/login` es ruta publica y usa `publicGuard`.
- `/` carga el layout autenticado y usa `authGuard`.
- `/clientes` vive como ruta hija del layout.
- `**` redirige al flujo principal.

La carga se hace con `loadComponent`, asi cada pagina puede partir en un chunk propio sin crear modulos de feature.

### 3. Guards funcionales

Los guards funcionales usan `inject()` y devuelven `true`, `false`, `UrlTree`, `Promise` u `Observable`. Sirven para UX y navegacion, no reemplazan seguridad backend.

En esta rama:

- `authGuard` protege el shell.
- `publicGuard` evita volver al login cuando ya existe sesion.

### 4. Signals y estado local

Signals modelan estado explicito. Un `signal()` guarda valor mutable, un `computed()` deriva valor, y `linkedSignal()` permite estado writable que se reinicia cuando cambia una fuente.

En `ClientsComponent` se combina:

- `toSignal()` para leer `valueChanges` de Reactive Forms.
- `linkedSignal()` para resetear pagina cuando cambia busqueda.
- `computed()` para crear trigger de carga.
- `toObservable()` para conectar signals con RxJS y servicios HTTP.

### 5. Change detection y zoneless

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

### 6. Zone pollution legacy

En apps con ZoneJS, tareas como `setInterval`, `requestAnimationFrame` o librerias de terceros podian disparar change detection aunque no cambiaran UI. Eso se conoce como zone pollution.

En zoneless el problema cambia: ya no dependes de ZoneJS para enterarte de todo. El codigo debe notificar estado relevante con signals, async pipe, inputs o `markForCheck`.

### 7. Routing avanzado minimo

El lab `/workshop/routing` muestra conceptos que conviene conocer temprano:

- Rutas hijas con `<router-outlet />` dentro de una pagina padre.
- Redirect local de `workshop/routing` a `overview`.
- Wildcard local para rutas desconocidas dentro del lab.
- Query params con `[queryParams]`.
- Resolver con `ResolveFn` antes de activar la ruta.
- `withComponentInputBinding()` para recibir params, query params, route data y resolved data como `input()`.
- `routerOutletData` para pasar contexto desde outlet padre a componente hijo.

Este lab no reemplaza el flujo real de la app; existe para que el instructor pueda abrir el codigo y explicar router sin meter deuda en clientes.

### Fuentes oficiales

- Runtime performance: https://angular.dev/best-practices/runtime-performance
- Zoneless: https://angular.dev/guide/zoneless
- `provideZonelessChangeDetection`: https://angular.dev/api/core/provideZonelessChangeDetection
- `ChangeDetectionStrategy`: https://angular.dev/api/core/ChangeDetectionStrategy
- `ChangeDetectorRef`: https://angular.dev/api/core/ChangeDetectorRef
- Routing common tasks: https://angular.dev/guide/routing/common-router-tasks
- Data resolvers: https://angular.dev/guide/routing/data-resolvers
