# Workshop 06 - RouterTestingHarness e Integracion Angular - Teoria y ejemplos

Esta sesion cierra la suite frontend con integration tests de router, guards, pages y layout.

## Navegacion

- [Inicio local](README.md).
- [Temario y recorrido](WORKSHOP_STAGE.md).
- [Ejemplos guiados](WORKSHOP_EXAMPLES.md).

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
