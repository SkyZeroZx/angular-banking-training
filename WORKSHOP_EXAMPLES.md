# Workshop 05 - Ejemplos guiados

Sesion fusionada: estos ejemplos aterrizan testing HTTP/interceptores y RouterTestingHarness en specs reales.

## Ejemplo 1 - HttpTestingController

Archivo base:

- `frontend/banking-front/src/app/core/services/client/client.service.spec.ts`

Punto a explicar:

```ts
const req = http.expectOne('/api/clients');
expect(req.request.method).toBe('GET');
req.flush(clientsFixture);
http.verify();
```

El test no depende del backend. Controla la request y la respuesta desde Angular testing.

## Ejemplo 2 - Tests CRUD de servicios

Archivos base:

- `frontend/banking-front/src/app/core/services/client/client.service.spec.ts`
- `frontend/banking-front/src/app/core/services/account/account.service.spec.ts`
- `frontend/banking-front/src/app/core/services/movement/movement.service.spec.ts`
- `frontend/banking-front/src/app/core/services/report/report.service.spec.ts`

Punto a explicar:

```ts
expect(req.request.method).toBe('POST');
expect(req.request.body).toEqual(payload);
```

Los specs validan contrato HTTP: endpoint, metodo, params, body y respuesta que consume la UI.

## Ejemplo 3 - Orden de providers HTTP

Archivo base:

- `frontend/banking-front/src/app/spec-helpers/http.spec-helper.ts`

Punto a explicar:

```ts
providers: [
  provideHttpClient(withInterceptors([authInterceptor])),
  provideHttpClientTesting(),
];
```

`provideHttpClientTesting()` debe quedar despues para reemplazar el backend HTTP real.

## Ejemplo 4 - Auth interceptor

Archivo base:

- `frontend/banking-front/src/app/core/interceptors/auth.interceptor.spec.ts`

Punto a explicar:

```ts
expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
```

El spec valida el efecto publico del interceptor: header agregado a la request.

## Ejemplo 5 - Error interceptor y HttpContext

Archivo base:

- `frontend/banking-front/src/app/core/interceptors/error.interceptor.spec.ts`

Punto a explicar:

```ts
context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true),
```

El test cubre manejo normal de error y camino donde la request decide saltar el interceptor.

## Ejemplo 6 - RouterTestingHarness

Archivos base:

- `frontend/banking-front/src/app/core/guards/auth.guard.spec.ts`
- `frontend/banking-front/src/app/pages/clients/edit/client-edit.component.spec.ts`

Punto a explicar:

```ts
const harness = await RouterTestingHarness.create();
await harness.navigateByUrl('/clientes/client-001/editar', ClientEditComponent);
```

El harness prueba navegacion completa, no solo el metodo del componente.

## Ejemplo 7 - Guards por navegacion

Archivo base:

- `frontend/banking-front/src/app/core/guards/auth.guard.spec.ts`

Punto a explicar:

```ts
await harness.navigateByUrl('/clientes');
expect(TestBed.inject(Router).url).toBe('/login');
```

El guard se valida por resultado observable para el usuario: ruta final.

## Ejemplo 8 - Route params y component input binding

Archivos base:

- `frontend/banking-front/src/app/pages/clients/edit/client-edit.component.ts`
- `frontend/banking-front/src/app/pages/clients/edit/client-edit.component.spec.ts`
- `frontend/banking-front/src/app/pages/accounts/edit/account-edit.component.spec.ts`

Punto a explicar:

```ts
readonly clienteId = input.required<string>();
```

El test navega a una URL con params. Angular entrega esos params como inputs.

## Ejemplo 9 - Page specs

Archivos base:

- `frontend/banking-front/src/app/pages/clients/clients.component.spec.ts`
- `frontend/banking-front/src/app/pages/accounts/accounts.component.spec.ts`
- `frontend/banking-front/src/app/pages/movements/movements.component.spec.ts`
- `frontend/banking-front/src/app/pages/reports/reports.component.spec.ts`

Punto a explicar:

```ts
expect(screen.text('Jose Lema')).toBeTruthy();
```

Page specs verifican flujo de pagina: carga, render, filtros y acciones principales.

## Ejemplo 10 - Testing boundaries

Archivos base:

- `frontend/banking-front/src/app/layout/content/content.component.spec.ts`
- `frontend/banking-front/src/app/layout/content/components/header/header.component.spec.ts`
- `frontend/banking-front/src/app/layout/content/components/side-bar/side-bar.component.spec.ts`
- `frontend/banking-front/src/app/layout/content/components/footer/footer.component.spec.ts`

Punto a explicar:

```ts
providers: [{ provide: AuthService, useValue: authServiceFake }];
```

Se prueban integraciones internas de Angular, pero se falsifican servicios externos o persistencia.
