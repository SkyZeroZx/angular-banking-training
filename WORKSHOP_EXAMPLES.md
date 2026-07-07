# Workshop 01 - Ejemplos guiados

Estos ejemplos aterrizan la teoria en archivos reales de esta rama. Cada bloque se puede mostrar en vivo durante la sesion sin crear features nuevas.

## Ejemplo 1 - Bootstrap standalone

Archivo base:

- `frontend/banking-front/src/main.ts`
- `frontend/banking-front/src/app/app.config.ts`
- `frontend/banking-front/src/app/app.routes.ts`

Punto a explicar:

```ts
bootstrapApplication(App, appConfig);
```

`app.config.ts` concentra providers globales. `app.routes.ts` define rutas lazy con `loadComponent`, sin `NgModule`.


## Ejemplo 2 - Guard funcional y shell protegido

Archivo base:

- `frontend/banking-front/src/app/core/guards/auth.guard.ts`
- `frontend/banking-front/src/app/app.routes.ts`

Punto a explicar:

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};
```

El guard decide navegacion en el frontend. La seguridad real queda en backend.


## Ejemplo 3 - Signals para estado local

Archivo base:

- `frontend/banking-front/src/app/pages/clients/clients.component.ts`

Punto a explicar:

```ts
readonly searchTerm = signal('');
readonly page = linkedSignal(() => (this.searchTerm(), 1));
readonly query = computed(() => ({
  page: this.page(),
  search: this.searchTerm() || undefined,
}));
```

`computed` deriva consulta. `linkedSignal` reinicia paginacion cuando cambia busqueda.


## Ejemplo 4 - Change detection zoneless

Ruta:

- `/workshop/change-detection`

Archivo base:

- `frontend/banking-front/src/app/workshop/change-detection/change-detection-lab.component.ts`

Comparacion:

- Signal: notifica cambio al template.
- Propiedad normal: cambia dato, no necesariamente avisa a Angular.
- `markForCheck`: avisa que hay trabajo pendiente.
- `detectChanges`: fuerza chequeo local.


## Ejemplo 5 - Routing avanzado

Ruta:

- `/workshop/routing`

Archivos base:

- `frontend/banking-front/src/app/workshop/routing/routing-demo.redirect.ts`
- `frontend/banking-front/src/app/workshop/routing/routing-demo.resolver.ts`
- `frontend/banking-front/src/app/workshop/routing/routing-detail.component.ts`

Punto a explicar:

```ts
{
  path: 'detalle/:id',
  data: { topic: 'Route data + resolver + component inputs' },
  resolve: { resolvedName: routingDemoNameResolver },
}
```

`withComponentInputBinding()` pasa params, data y resolver output como inputs del componente.

