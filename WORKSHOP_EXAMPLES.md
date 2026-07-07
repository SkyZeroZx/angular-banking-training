# Workshop 05 - Ejemplos guiados

Estos ejemplos aterrizan testing HTTP, servicios e interceptores en specs reales.

## Ejemplo 1 - HttpTestingController

Archivos base:

- `frontend/banking-front/src/app/core/services/client/client.service.spec.ts`
- `frontend/banking-front/src/app/spec-helpers/http.spec-helper.ts`

Punto a explicar:

```ts
const req = httpMock.expectOne((request) =>
  request.url.endsWith('/api/clientes'),
);
expect(req.request.method).toBe('GET');
req.flush(pagedResponse([...]));
```

El test controla request y response sin servidor real.


## Ejemplo 2 - Tests CRUD de servicios

Archivos base:

- `frontend/banking-front/src/app/core/services/account/account.service.spec.ts`
- `frontend/banking-front/src/app/core/services/movement/movement.service.spec.ts`
- `frontend/banking-front/src/app/core/services/client/client.service.spec.ts`

Punto a explicar:

```ts
service.create(body).subscribe((response) => {
  expect(response.numeroCuenta).toBe(body.numeroCuenta);
});
```

Cada spec valida metodo HTTP, URL, body y transformacion minima.


## Ejemplo 3 - Orden de providers HTTP

Archivos base:

- `frontend/banking-front/src/app/core/services/report/report.service.spec.ts`
- `frontend/banking-front/src/app/core/interceptors/auth.interceptor.spec.ts`

Punto a explicar:

```ts
providers: [
  provideHttpClient(withInterceptors([authInterceptor])),
  provideHttpClientTesting(),
];
```

`provideHttpClientTesting()` debe ir despues para reemplazar backend real por backend de test.


## Ejemplo 4 - Auth interceptor

Archivo base:

- `frontend/banking-front/src/app/core/interceptors/auth.interceptor.spec.ts`

Punto a explicar:

```ts
expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
```

El interceptor se testea con una request anonima y un `AuthService` fake.


## Ejemplo 5 - Error interceptor

Archivo base:

- `frontend/banking-front/src/app/core/interceptors/error.interceptor.spec.ts`

Punto a explicar:

```ts
req.flush({ message: 'Saldo no disponible' }, { status: 400, statusText: 'Bad Request' });
```

El spec controla error HTTP y valida efectos: toast, redirect o rethrow.


## Ejemplo 6 - HttpContext en tests

Archivos base:

- `frontend/banking-front/src/app/core/http/http-context.tokens.ts`
- `frontend/banking-front/src/app/core/interceptors/error.interceptor.spec.ts`

Punto a explicar:

```ts
http.get('/api/demo', {
  context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true),
});
```

El test valida que el opt-out desactiva comportamiento transversal.

