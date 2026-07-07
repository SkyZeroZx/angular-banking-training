# Workshop 05 - Testing HTTP, Servicios e Interceptores - Teoria y ejemplos

Esta sesion prueba contratos HTTP sin backend real: servicios, params, headers, errores e interceptores.

## Navegacion

- [Inicio local](README.md).
- [Temario y recorrido](WORKSHOP_STAGE.md).
- [Ejemplos guiados](WORKSHOP_EXAMPLES.md).

## Teoria Angular Testing

### HttpTestingController

`HttpTestingController` permite interceptar requests hechos por `HttpClient` y responder desde el test. Asi se valida el contrato HTTP sin levantar backend.

Ejemplo minimo:

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});

const service = TestBed.inject(ClientService);
const httpMock = TestBed.inject(HttpTestingController);

service.getAll({ page: 1, size: 10 }).subscribe((response) => {
  expect(response.totalElements).toBe(1);
});

const req = httpMock.expectOne((request) => request.url.endsWith("/clientes"));
expect(req.request.method).toBe("GET");
expect(req.request.params.get("page")).toBe("1");
req.flush({ content: [], totalElements: 1 });
httpMock.verify();
```

### Tests de servicios

Un servicio HTTP se prueba por URL, metodo, params, headers, body y transformacion de response. No se mockea `HttpClient`; se observa el request real capturado por testing backend.

Ejemplo minimo:

```ts
service.create(payload).subscribe();

const req = httpMock.expectOne("/api/clientes");
expect(req.request.method).toBe("POST");
expect(req.request.body).toEqual(payload);
req.flush(createdClient);
```

### Orden de providers HTTP

Primero se configura el cliente real y sus features. Luego se reemplaza backend real por testing backend.

Ejemplo minimo:

```ts
providers: [
  provideHttpClient(withInterceptors([authInterceptor])),
  provideHttpClientTesting(),
];
```

### Interceptores

Un interceptor se prueba ejecutando un request real de test y verificando el request transformado o el efecto esperado.

Ejemplo minimo:

```ts
const req = httpMock.expectOne("/api/cuentas");
expect(req.request.headers.get("Authorization")).toBe("Bearer token");
req.flush([]);
```

### HttpContext en tests

`HttpContext` permite activar o saltar comportamiento transversal por request. En tests se valida que el interceptor respete ese contrato.

Ejemplo minimo:

```ts
http.get("/api/reportes", {
  context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true),
});
```

## Documentacion oficial

- HTTP testing: https://angular.dev/guide/http/testing
- HTTP client: https://angular.dev/guide/http
- HTTP interceptors: https://angular.dev/guide/http/interceptors
- `HttpTestingController`: https://angular.dev/api/common/http/testing/HttpTestingController
- `provideHttpClientTesting`: https://angular.dev/api/common/http/testing/provideHttpClientTesting
