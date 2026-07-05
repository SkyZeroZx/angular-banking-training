# Angular Banking Training

Repositorio full-stack para capacitacion Angular. Cada rama `workshop/*` es un snapshot incremental y ejecutable.

## Rama Actual

Lee [WORKSHOP_STAGE.md](WORKSHOP_STAGE.md) para ver como dictar esta sesion y donde ampliar cada tema en la documentacion oficial.

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

## Workshop 01 - Shell, Routing y Signals

Esta sesion presenta la base moderna de Angular: aplicacion standalone, routing lazy, guards funcionales, estado local con signals y dos labs aislados para explicar change detection y router.

## Temario

1. Bootstrap standalone con `main.ts`, `app.ts` y `app.config.ts`.
2. Providers globales: `provideRouter`, `withComponentInputBinding`, `provideHttpClient`.
3. Router principal: `loadComponent`, children, redirects, wildcard y guards.
4. Shell autenticado: layout, sidebar y `router-outlet`.
5. Estado local de clientes con `signal`, `computed`, `linkedSignal`, `toSignal` y `toObservable`.
6. Change detection zoneless: signals, callbacks asincronos, `markForCheck`, `detectChanges`.
7. Routing lab: route params, query params, resolver, wildcard local y `routerOutletData`.

## Teoria Angular

### Bootstrap standalone

Angular moderno permite arrancar una app sin `NgModule`. El entrypoint llama `bootstrapApplication`, el componente raiz define el primer `router-outlet`, y `ApplicationConfig` concentra providers de aplicacion.

Ejemplo minimo:

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { App } from "./app/app";
import { appRoutes } from "./app/app.routes";

bootstrapApplication(App, {
  providers: [provideRouter(appRoutes, withComponentInputBinding())],
});
```

### Routing lazy

`loadComponent` carga una pagina cuando la navegacion la necesita. Esto mantiene bajo el costo inicial sin crear modulos de feature.

Ejemplo minimo:

```ts
export const appRoutes = [
  {
    path: "clientes",
    title: "Clientes",
    loadComponent: () =>
      import("./pages/clients/clients.component").then(
        (m) => m.ClientsComponent,
      ),
  },
  { path: "**", redirectTo: "clientes" },
];
```

### Guards funcionales

Un guard funcional usa `inject()` y devuelve `true`, `false`, `UrlTree`, `Promise` u `Observable`. Sirve para navegacion y UX; la autorizacion real tambien se valida en backend.

Ejemplo minimo:

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? true : router.parseUrl("/login");
};
```

### Signals y RxJS interop

Signals expresan estado local de UI. `computed` deriva estado. `linkedSignal` permite reiniciar estado writable cuando cambia una fuente. `toSignal` y `toObservable` conectan Angular signals con streams RxJS existentes.

Ejemplo minimo:

```ts
readonly searchTerm = signal('');
readonly page = linkedSignal(() => (this.searchTerm(), 1));
readonly query = computed(() => ({
  page: this.page(),
  search: this.searchTerm() || undefined,
}));
```

### Change detection zoneless

Angular 21 usa zoneless por defecto. En este modelo Angular actualiza vista cuando recibe notificaciones claras: signals leidas por template, eventos de template, `markForCheck`, `setInput`, entre otras.

Ejemplo minimo:

```ts
readonly status = signal('idle');

load() {
  window.setTimeout(() => {
    this.status.set('ready');
  }, 500);
}
```

Callback externo con propiedad normal:

```ts
private readonly cdr = inject(ChangeDetectorRef);
status = 'idle';

connect(widget: { onReady(callback: () => void): void }) {
  widget.onReady(() => {
    this.status = 'ready';
    this.cdr.markForCheck();
  });
}
```

### Router avanzado del lab

El lab `/workshop/routing` muestra child routes, redirect local, wildcard local, resolver, query params, `withComponentInputBinding()` y `routerOutletData`.

Ejemplo minimo:

```ts
{
  path: 'detalle/:id',
  data: { topic: 'Route data' },
  resolve: { name: demoResolver },
  loadComponent: () => import('./detail').then((m) => m.Detail),
}
```

```ts
export class Detail {
  readonly id = input.required<string>();
  readonly topic = input.required<string>();
  readonly name = input.required<string>();
}
```

## Demos disponibles

- `/workshop/change-detection`: compara signal, propiedad normal, `markForCheck` y `detectChanges`.
- `/workshop/routing`: muestra rutas hijas, resolver, wildcard local y component input binding.

## Documentacion oficial

- Components: https://angular.dev/guide/components
- Signals: https://angular.dev/guide/signals
- Zoneless: https://angular.dev/guide/zoneless
- Routing overview: https://angular.dev/guide/routing
- Define routes: https://angular.dev/guide/routing/define-routes
- Route guards: https://angular.dev/guide/routing/route-guards
- Data resolvers: https://angular.dev/guide/routing/data-resolvers
