# Workshop 06 - Ejemplos guiados

Estos ejemplos aterrizan RouterTestingHarness e integration testing en specs reales.

## Ejemplo 1 - Integration test Angular

Archivo base:

- `frontend/banking-front/src/app/pages/login/login.component.spec.ts`

Punto a explicar:

```ts
await TestBed.configureTestingModule({
  imports: [LoginComponent],
  providers: [...fakeProviders],
}).compileComponents();
```

El spec monta componente real con providers falsos en los bordes.


## Ejemplo 2 - RouterTestingHarness

Archivos base:

- `frontend/banking-front/src/app/core/guards/auth.guard.spec.ts`
- `frontend/banking-front/src/app/pages/clients/edit/client-edit.component.spec.ts`

Punto a explicar:

```ts
const harness = await RouterTestingHarness.create();
await harness.navigateByUrl('/clientes/client-001/editar', ClientEditComponent);
```

El harness prueba la navegacion completa, no solo el metodo del componente.


## Ejemplo 3 - Guards por navegacion

Archivo base:

- `frontend/banking-front/src/app/core/guards/auth.guard.spec.ts`

Punto a explicar:

```ts
await harness.navigateByUrl('/clientes');
expect(TestBed.inject(Router).url).toBe('/login');
```

El guard se valida por resultado observable para el usuario: ruta final.


## Ejemplo 4 - Route params y component input binding

Archivos base:

- `frontend/banking-front/src/app/pages/clients/edit/client-edit.component.ts`
- `frontend/banking-front/src/app/pages/clients/edit/client-edit.component.spec.ts`
- `frontend/banking-front/src/app/pages/accounts/edit/account-edit.component.spec.ts`

Punto a explicar:

```ts
readonly clienteId = input.required<string>();
```

El test navega a una URL con params. Angular entrega esos params como inputs.


## Ejemplo 5 - Page specs

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


## Ejemplo 6 - Testing boundaries

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

