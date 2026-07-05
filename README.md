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

## Workshop 06 - RouterTestingHarness e Integracion Angular

Esta sesion cierra la suite frontend con integration tests de router, guards, pages y layout.

## Temario

1. Boundary entre unit, component integration, router integration y E2E.
2. `RouterTestingHarness` como API de navegacion en tests.
3. Guards probados por resultado de navegacion.
4. Login flow con router y providers fake.
5. Edit pages con route params y `withComponentInputBinding()`.
6. Create/list page specs con DOM y servicios fake.
7. Layout specs con shell, sidebar y outlet.

## Teoria Angular Testing

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
await harness.navigateByUrl("/clientes/10/editar", ClientEditComponent);

expect(harness.routeNativeElement?.textContent).toContain("Editar cliente");
```

### Guards por navegacion

Un guard se prueba mejor navegando. Asi se valida redirect, ruta final y contenido visible.

Ejemplo minimo:

```ts
await harness.navigateByUrl("/clientes");

expect(TestBed.inject(Router).url).toBe("/login");
```

### Route params y component input binding

Si la app usa `withComponentInputBinding()`, el test navega por URL y valida el comportamiento del componente con params reales.

Ejemplo minimo:

```ts
await harness.navigateByUrl("/cuentas/ABC-123/editar", AccountEditComponent);

expect(accountService.getById).toHaveBeenCalledWith("ABC-123");
```

### Page specs

Los specs de page validan render, submit, navegacion y servicios fake. El assert debe expresar comportamiento visible o contrato publico, no implementacion interna.

Ejemplo minimo:

```ts
click(getByTestId(fixture, "save-button"));

expect(accountService.create).toHaveBeenCalledWith(expectedPayload);
expect(router.url).toBe("/cuentas");
```

### Testing boundaries

- Unit: funcion, mapper, adapter, service puro.
- Component integration: template + DOM + TestBed.
- Router integration: rutas + harness + guards.
- E2E: navegador real + entorno integrado.

## Documentacion oficial

- Routing testing: https://angular.dev/guide/routing/testing
- Component testing basics: https://angular.dev/guide/testing/components-basics
- Component testing scenarios: https://angular.dev/guide/testing/components-scenarios
- Services testing: https://angular.dev/guide/testing/services
- Router reference: https://angular.dev/guide/routing
