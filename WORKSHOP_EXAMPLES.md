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

Mini ejercicio:

1. Abrir `app.config.ts`.
2. Identificar `provideRouter`.
3. Relacionar `withComponentInputBinding()` con el lab de routing.

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

Mini ejercicio:

1. Borrar token de session storage.
2. Navegar a `/clientes`.
3. Ver redireccion a `/login`.

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

Mini ejercicio:

1. Escribir en el filtro de clientes.
2. Ver que `page` vuelve a 1.
3. Mostrar que el template lee signals sin suscripciones manuales.

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

Mini ejercicio:

1. Ejecutar mutacion con propiedad normal.
2. Esperar el timer.
3. Forzar chequeo local.
4. Repetir con signal y comparar.

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

Mini ejercicio:

1. Navegar a `/workshop/routing/detalle/42`.
2. Cambiar el id en URL.
3. Ver que inputs cambian sin leer `ActivatedRoute` directamente.
