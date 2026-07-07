# Workshop 05 - Testing HTTP, Interceptores y RouterTestingHarness - Teoria y ejemplos

Esta sesion fusiona el contenido de testing HTTP/interceptores con integration testing de router, guards, pages y layout.

## Navegacion

- [Inicio local](README.md).
- [Temario y recorrido](WORKSHOP_STAGE.md).
- [Ejemplos guiados](WORKSHOP_EXAMPLES.md).

## Teoria Angular Testing

### HttpTestingController

`HttpTestingController` reemplaza el backend real dentro del test. El spec dispara el metodo del servicio, captura la request esperada, valida URL/metodo/body y responde con `flush`.

Ejemplo minimo:

```ts
const result$ = service.list();

const req = http.expectOne('/api/clients');
expect(req.request.method).toBe('GET');
req.flush([{ id: 'client-001', name: 'Ana' }]);

await expectAsync(firstValueFrom(result$)).toBeResolved();
http.verify();
```

### Tests de servicios

Los services specs prueban el contrato HTTP: URL, metodo, query params, body enviado y forma del response que consume la app. No prueban template ni router.

Ejemplo minimo:

```ts
service.create({ name: 'Ana' }).subscribe();

const req = http.expectOne('/api/clients');
expect(req.request.method).toBe('POST');
expect(req.request.body).toEqual({ name: 'Ana' });
req.flush({ id: 'client-001', name: 'Ana' });
```

### Orden de providers HTTP

En Angular standalone, el orden importa. Primero se registra HTTP real; luego el testing backend lo reemplaza.

```ts
providers: [
  provideHttpClient(withInterceptors([authInterceptor])),
  provideHttpClientTesting(),
];
```

### Interceptores

Un interceptor se prueba haciendo una request real desde `HttpClient` dentro del TestBed y observando la request capturada. Asi se valida el efecto publico: headers, redirect, toast o manejo de error.

```ts
httpClient.get('/api/clients').subscribe();

const req = http.expectOne('/api/clients');
expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
req.flush([]);
```

### HttpContext en tests

`HttpContext` permite activar o saltar comportamiento de interceptor por request. El test debe validar ambos caminos.

```ts
httpClient
  .get('/api/clients', {
    context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true),
  })
  .subscribe();
```

### Integration test Angular

Un integration test de page valida colaboracion entre router, componente, template, providers y DOM visible. No usa navegador real ni backend real, pero si usa runtime Angular.

### RouterTestingHarness

`RouterTestingHarness` permite navegar con rutas de test y observar el componente renderizado.

Ejemplo minimo:

```ts
TestBed.configureTestingModule({
  providers: [provideRouter(routes)],
});

const harness = await RouterTestingHarness.create();
await harness.navigateByUrl('/clientes/10/editar', ClientEditComponent);

expect(harness.routeNativeElement?.textContent).toContain('Editar cliente');
```

### Guards por navegacion

Un guard se prueba mejor navegando. Asi se valida redirect, ruta final y contenido visible.

Ejemplo minimo:

```ts
await harness.navigateByUrl('/clientes');

expect(TestBed.inject(Router).url).toBe('/login');
```

### Route params y component input binding

Si la app usa `withComponentInputBinding()`, el test navega por URL y valida comportamiento con params reales.

Ejemplo minimo:

```ts
await harness.navigateByUrl('/cuentas/ABC-123/editar', AccountEditComponent);

expect(accountService.getById).toHaveBeenCalledWith('ABC-123');
```

### Page specs

Los specs de page validan render, submit, navegacion y servicios fake. El assert debe expresar comportamiento visible o contrato publico, no implementacion interna.

Ejemplo minimo:

```ts
click(getByTestId(fixture, 'save-button'));

expect(accountService.create).toHaveBeenCalledWith(expectedPayload);
expect(router.url).toBe('/cuentas');
```

### Testing boundaries

- Unit: funcion, mapper, adapter, service puro.
- Component integration: template + DOM + TestBed.
- Router integration: rutas + harness + guards.
- E2E: navegador real + entorno integrado.

## Documentacion oficial

- HTTP testing: https://angular.dev/guide/http/testing
- HTTP interceptors: https://angular.dev/guide/http/interceptors
- Routing testing: https://angular.dev/guide/routing/testing
- Component testing basics: https://angular.dev/guide/testing/components-basics
- Component testing scenarios: https://angular.dev/guide/testing/components-scenarios
- Services testing: https://angular.dev/guide/testing/services
