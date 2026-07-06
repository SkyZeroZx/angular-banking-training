# Workshop 01 - Shell, Routing y Signals - Teoria y ejemplos

Esta sesion presenta la base moderna de Angular: aplicacion standalone, routing lazy, guards funcionales, estado local con signals y dos labs aislados para explicar change detection y router.

## Navegacion

- [Inicio local](README.md).
- [Temario y recorrido](WORKSHOP_STAGE.md).

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

`loadComponent` y `loadChildren` corren dentro de un contexto de inyeccion del route. Eso permite decisiones de carga basadas en providers disponibles para esa ruta.

Ejemplo minimo:

```ts
{
  path: 'dashboard',
  loadComponent: () => {
    const flags = inject(FeatureFlags);

    return flags.useNewDashboard()
      ? import('./new-dashboard').then((m) => m.NewDashboard)
      : import('./dashboard').then((m) => m.Dashboard);
  },
}
```

### RedirectFunction con injection context

`redirectTo` no solo acepta strings. Tambien acepta una `RedirectFunction`, que corre en injection context y puede usar `inject()`. Es util para redirecciones de migracion, defaults dinamicos o URLs legacy que dependen de configuracion.

La funcion recibe un snapshot parcial porque el matching aun no termina. Por eso no debe asumir datos que aparecen despues de activar la ruta, como resolvers.

Ejemplo minimo:

```ts
export const DEFAULT_CLIENT_ID = new InjectionToken<string>(
  "default client id",
);

export const clientRedirect: RedirectFunction = (route) => {
  const router = inject(Router);
  const defaultId = inject(DEFAULT_CLIENT_ID);
  const id = route.queryParams["id"] ?? defaultId;

  return router.createUrlTree(["/clientes", id], {
    queryParams: { source: "redirect-function" },
  });
};
```

```ts
{
  path: 'cliente-actual',
  providers: [{ provide: DEFAULT_CLIENT_ID, useValue: '42' }],
  redirectTo: clientRedirect,
}
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

### CanMatch para feature gating

`canMatch` decide si una ruta participa en el matching. Si devuelve `false`, Angular sigue buscando otra ruta compatible. En apps reales sirve para feature flags, permisos por tenant o variantes de producto.

Ejemplo minimo:

```ts
export const betaCanMatch: CanMatchFn = () => {
  const flags = inject(FeatureFlags);

  return flags.enabled("new-accounts");
};
```

```ts
[
  {
    path: "cuentas",
    canMatch: [betaCanMatch],
    loadComponent: () => import("./new-accounts"),
  },
  { path: "cuentas", loadComponent: () => import("./accounts") },
];
```

### Route providers

Una ruta puede declarar providers propios. Angular crea un `EnvironmentInjector` para esa ruta y sus hijos. Es util para scopes de feature, configuracion local, adapters o tokens que no deben ser globales.

Ejemplo minimo:

```ts
{
  path: 'reportes',
  providers: [{ provide: REPORT_PAGE_SIZE, useValue: 20 }],
  loadComponent: () => import('./reports').then((m) => m.ReportsComponent),
}
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

El lab `/workshop/routing` muestra child routes, redirect local, `RedirectFunction`, wildcard local, resolver, query params, `withComponentInputBinding()` y `routerOutletData`.

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

### Resolvers y RedirectCommand

Un resolver carga datos antes de activar la ruta. Si no puede obtener datos criticos, puede devolver un `RedirectCommand` para cancelar esa activacion y navegar a otro destino.

Ejemplo minimo:

```ts
export const clientResolver: ResolveFn<Client | RedirectCommand> = (route) => {
  const router = inject(Router);
  const service = inject(ClientService);
  const id = route.paramMap.get("id")!;

  return service
    .getById(id)
    .pipe(
      catchError(() => of(new RedirectCommand(router.parseUrl("/clientes")))),
    );
};
```

### Navigation error handler

`withNavigationErrorHandler` centraliza errores de navegacion: lazy imports fallidos, resolvers con error no manejado o fallos inesperados del router. En apps reales evita pantallas rotas sin fallback.

Ejemplo minimo:

```ts
provideRouter(
  appRoutes,
  withNavigationErrorHandler((error) => {
    const router = inject(Router);
    console.error(error);

    return new RedirectCommand(router.parseUrl("/clientes"));
  }),
);
```

En esta rama, `app.config.ts` usa el mismo patron para mandar fallos de navegacion a `/clientes`.

### Router config util

`withRouterConfig` permite ajustar comportamiento global del router. Dos opciones utiles en apps reales:

- `defaultQueryParamsHandling: 'merge'`: conserva filtros/paginacion por defecto.
- `urlUpdateStrategy: 'eager'`: escribe URL al iniciar navegacion, util para diagnostico de guards o errores largos.

Ejemplo minimo:

```ts
provideRouter(
  appRoutes,
  withRouterConfig({
    defaultQueryParamsHandling: "merge",
  }),
);
```

### Preloading y scroll

Para apps con varias rutas `loadChildren`, `withPreloading(PreloadAllModules)` puede mejorar navegacion posterior. Para UX de documentos o listados, `withInMemoryScrolling` ayuda con scroll restoration y anchors.

Ejemplo minimo:

```ts
provideRouter(
  appRoutes,
  withInMemoryScrolling({ scrollPositionRestoration: "enabled" }),
);
```

En esta rama se activa `scrollPositionRestoration`. `withPreloading` queda como criterio para features grandes cargadas con `loadChildren`.

## Demos disponibles

- `/workshop/change-detection`: compara signal, propiedad normal, `markForCheck` y `detectChanges`.
- `/workshop/routing`: muestra rutas hijas, redirect local, `RedirectFunction`, resolver, wildcard local y component input binding.

## Documentacion oficial

- Components: https://angular.dev/guide/components
- Signals: https://angular.dev/guide/signals
- Zoneless: https://angular.dev/guide/zoneless
- Routing overview: https://angular.dev/guide/routing
- Define routes: https://angular.dev/guide/routing/define-routes
- Redirecting routes: https://angular.dev/guide/routing/redirecting-routes
- Route loading strategies: https://angular.dev/guide/routing/loading-strategies
- Route guards: https://angular.dev/guide/routing/route-guards
- Data resolvers: https://angular.dev/guide/routing/data-resolvers
- Customizing route behavior: https://angular.dev/guide/routing/customizing-route-behavior
- `RedirectFunction`: https://angular.dev/api/router/RedirectFunction
- `Route`: https://angular.dev/api/router/Route
