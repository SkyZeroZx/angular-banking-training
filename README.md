# Angular Banking Training

Repositorio full-stack para capacitacion Angular. Cada rama `workshop/*` es un snapshot incremental y ejecutable.

## Rama Actual

Lee [WORKSHOP_STAGE.md](WORKSHOP_STAGE.md) para ver como dictar esta sesion y donde ampliar cada tema en la documentacion oficial.

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

## Workshop 05 - Testing HTTP, Servicios e Interceptores

Esta sesion prueba contratos HTTP sin backend real: servicios, params, headers, errores e interceptores.

## Temario

1. Testing HTTP sin backend real.
2. `HttpTestingController`: `expectOne`, `flush`, errores y `verify`.
3. Specs de servicios CRUD.
4. Query params, headers y body como contrato.
5. Report service y normalizacion de responses.
6. Interceptores con `provideHttpClient(withInterceptors(...))`.
7. Orden correcto entre `provideHttpClient` y `provideHttpClientTesting`.
8. Opt-out con `HttpContext`.

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
