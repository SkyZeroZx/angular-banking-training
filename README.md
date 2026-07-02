# Local Banking Platform

Aplicacion bancaria full-stack con autenticacion JWT, API Gateway, servicios Spring Boot y frontend Angular.

## Inicio rapido local

La ejecucion local no necesita PostgreSQL ni Redis. Los servicios usan H2 en memoria, `ddl-auto=create-drop`, seed minimo y cache simple de Spring.

Abre tres terminales:

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

Luego levanta el frontend:

```bash
cd frontend/banking-front
npm ci
npm start
```

Abre `http://localhost:4200` e inicia sesion con:

| Usuario | Password   |
| ------- | ---------- |
| `admin` | `admin123` |

Servicios locales:

| Servicio        | URL                                |
| --------------- | ---------------------------------- |
| API Gateway     | `http://localhost:8080`            |
| Banking Service | `http://localhost:8090`            |
| Auth Service    | `http://localhost:8091`            |
| H2 Auth         | `http://localhost:8091/h2-console` |
| H2 Banking      | `http://localhost:8090/h2-console` |

Credenciales H2 locales:

| Campo            | Valor                         |
| ---------------- | ----------------------------- |
| JDBC URL auth    | `jdbc:h2:mem:auth-service`    |
| JDBC URL banking | `jdbc:h2:mem:banking-service` |
| User             | `sa`                          |
| Password         | vacio                         |

## Seed local

El seed esta activo por defecto con `APP_SEED_ENABLED=true`.

Auth crea el usuario admin:

| Usuario | Password   | Rol     |
| ------- | ---------- | ------- |
| `admin` | `admin123` | `ADMIN` |

Banking crea datos minimos para probar la app:

| Cliente     | Cliente ID   | Cuentas  |
| ----------- | ------------ | -------- |
| Jose Lema   | `client-001` | `478758` |
| Maria Gomez | `client-002` | `225487` |

Para desactivar seed:

```bash
APP_SEED_ENABLED=false mvn -pl auth-service spring-boot:run
APP_SEED_ENABLED=false mvn -pl banking-service spring-boot:run
```

En PowerShell:

```powershell
$env:APP_SEED_ENABLED='false'; mvn -pl auth-service spring-boot:run
$env:APP_SEED_ENABLED='false'; mvn -pl banking-service spring-boot:run
```

## Docker

Docker sigue disponible para correr con PostgreSQL y Redis.

Backend:

```bash
cd backend
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Frontend:

```bash
cd frontend/banking-front
docker compose up --build
```

En Docker, `application-docker.yml` usa PostgreSQL y Redis; `app.seed.enabled=false` en el perfil base docker, y los compose `dev`/`staging` cargan seed SQL.

## Postman

Importa `banking-local.postman_collection.json`. Ejecuta primero `Auth > Login`; el script guarda el Bearer token y precarga variables de clientes/cuentas para usar el resto de endpoints.

## Estructura

```text
banking-fullstack-local/
├── backend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── banking-service/
│   └── e2e/
└── frontend/
    └── banking-front/
```

## Backend

Variables principales:

| Variable            | Default local                     | Uso                |
| ------------------- | --------------------------------- | ------------------ |
| `DB_URL`            | H2 en memoria                     | JDBC URL           |
| `DB_USERNAME`       | `sa`                              | Usuario DB         |
| `DB_PASSWORD`       | vacio                             | Password DB        |
| `DB_DRIVER`         | `org.h2.Driver`                   | Driver JDBC        |
| `HIBERNATE_DIALECT` | `org.hibernate.dialect.H2Dialect` | Dialecto Hibernate |
| `APP_SEED_ENABLED`  | `true`                            | Seed minimo        |
| `JWT_SECRET`        | secreto local                     | Firma JWT          |

Tests:

```bash
cd backend
mvn test
```

## Frontend

Comandos utiles:

```bash
cd frontend/banking-front
npm ci
npm start
npm test -- --runInBand
npm run lint
npm run build
```

El frontend usa `http://localhost:8080` como API Gateway por defecto.

## Workshop Angular

Objetivo: usar el frontend como caso real para explicar como se arma una app Angular moderna, mantenible y testeable. Cada sesion dura aprox. 1h 30min y usa el mismo proyecto bancario como hilo conductor.

Ramas sugeridas del workshop:

| Rama | Sesion | Enfoque |
| ---- | ------ | ------- |
| `workshop/01-shell-routing-signals` | Frontend 1 | App shell, standalone, rutas lazy, signals |
| `workshop/02-ui-cva-forms` | Frontend 2 | UI propia, formularios, CVA, validacion |
| `workshop/03-http-errors-analytics` | Frontend 3 | HTTP, interceptores, errores, analytics |
| `workshop/04-testing-components-cva` | Testing 1 | Component tests, DOM helpers, CVA |
| `workshop/05-testing-http-interceptors` | Testing 2 | HttpTestingController, servicios, interceptores |
| `workshop/06-testing-router-integration` | Testing 3 | RouterTestingHarness, guards, integracion |

Para cambiar de sesion:

```bash
git fetch origin
git switch workshop/01-shell-routing-signals
```

### Frontend 1 - Shell moderno, rutas y estado reactivo

Duracion: 1h 30min.

Objetivo de la sesion: entender como arranca una app Angular moderna sin `NgModule`, como se organizan providers globales, rutas lazy y estado con signals.

Material a mostrar:

| Tema | Archivos |
| ---- | -------- |
| Bootstrap standalone | `frontend/banking-front/src/app/app.config.ts`, `app.ts` |
| Rutas lazy y guards | `frontend/banking-front/src/app/app.routes.ts`, `core/guards/auth.guard.ts` |
| Layout autenticado | `layout/content/content.component.ts`, `side-bar`, `header` |
| Estado de paginas | `pages/clients/clients.component.ts`, `pages/accounts/accounts.component.ts` |
| RxJS + signals | `toSignal`, `toObservable`, `linkedSignal`, `computed`, `signal` |

Guion:

1. 0-10 min: explicar dominio minimo: clientes, cuentas, movimientos, reportes. Mostrar flujo local con login `admin/admin123`.
2. 10-25 min: abrir `app.config.ts`. Explicar `ApplicationConfig`, `provideRouter`, `provideHttpClient`, `withFetch`, service worker, toast, analytics y error handler como providers globales.
3. 25-40 min: abrir `app.routes.ts`. Explicar `loadComponent`, lazy loading por pantalla, `canActivate`, layout protegido y `withComponentInputBinding` para rutas de edicion.
4. 40-60 min: abrir `clients.component.ts`. Explicar estado local con `signal`, `computed`, `toSignal`, `toObservable` y `linkedSignal` para resetear pagina cuando cambia busqueda.
5. 60-75 min: comparar `clients`, `accounts` y `reports`: mismo patron de lista, paginacion, search debounce, refresh tick y manejo de carga.
6. 75-90 min: ejercicio guiado: agregar un filtro simple o cambiar page size y revisar que el flujo reactivo no necesita `subscribe` manual en la vista.

Mensajes clave:

- Standalone no significa app sin arquitectura; significa providers y dependencias mas explicitos.
- Signals sirven para estado local de UI; RxJS sigue fuerte para streams async.
- `linkedSignal` evita estados derivados inconsistentes, como pagina actual vs busqueda.
- Rutas lazy por feature reducen acoplamiento y hacen mas claro el ownership de cada pantalla.

### Frontend 2 - UI propia, CVA y formularios reutilizables

Duracion: 1h 30min.

Objetivo de la sesion: mostrar como una UI propia puede integrarse con Angular Forms sin perder accesibilidad, validacion ni composicion.

Material a mostrar:

| Tema | Archivos |
| ---- | -------- |
| Inputs UI con CVA | `shared/ui/form-field/input-field/input-field.component.ts` |
| Select custom | `shared/ui/form-field/select-field/select-field.component.ts` |
| Checkbox CVA | `shared/ui/form-field/checkbox-field/checkbox-field.component.ts` |
| Formularios compuestos | `pages/clients/components/client-form.component.ts`, `pages/accounts/components/account-form.component.ts`, `pages/movements/components/movement-form.component.ts` |
| Selects paginados | `shared/components/base-paged-select.ts`, `client-select-field.component.ts`, `account-select-field.component.ts` |
| Tabla y paginador | `shared/ui/data-table`, `shared/ui/paginator` |

Guion:

1. 0-10 min: explicar problema: si cada pantalla dibuja sus propios inputs, la deuda crece en validacion, estilos y accesibilidad.
2. 10-30 min: abrir `InputFieldComponent`. Explicar `ControlValueAccessor`, `NgControl`, `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState` y `aria-invalid`.
3. 30-45 min: abrir `SelectFieldComponent`. Explicar UI headless simple: `input()`, `output()`, `computed`, `afterNextRender`, busqueda local, cierre por click externo y eventos de teclado.
4. 45-60 min: abrir `ClientFormComponent` o `AccountFormComponent`. Explicar CVA compuesto: un form entero se vuelve un control reusable con `NG_VALUE_ACCESSOR` y `NG_VALIDATORS`.
5. 60-72 min: abrir `BasePagedSelectComponent`. Explicar abstraccion pragmatica: componente base para selects remotos, debounce, infinite scroll, `switchMap` para busqueda y `exhaustMap` para scroll.
6. 72-82 min: abrir `DataTableComponent` y `TableColumnDirective`. Explicar `contentChildren`, template context guard y columnas tipadas.
7. 82-90 min: ejercicio guiado: agregar una opcion al select o un campo nuevo en un form compuesto y revisar cuanto codigo se toca.

Mensajes clave:

- CVA permite que componentes propios se comporten como controles nativos.
- CVA compuesto sirve cuando una pantalla quiere consumir un formulario como un solo control.
- La UI propia debe exponer contratos chicos: inputs, outputs, forms y templates; no detalles internos.
- La accesibilidad se diseña dentro del componente UI, no se repite por pantalla.

### Frontend 3 - HTTP, errores globales y providers componibles

Duracion: 1h 30min.

Objetivo de la sesion: explicar patrones transversales de una app productiva: servicios HTTP, interceptores, error global, toast, analytics y estrategias tree-shakeables.

Material a mostrar:

| Tema | Archivos |
| ---- | -------- |
| Servicios HTTP | `core/services/client`, `account`, `movement`, `report` |
| Normalizacion de backend | `core/services/report/report.service.ts` |
| Auth interceptor | `core/interceptors/auth.interceptor.ts` |
| Error interceptor | `core/interceptors/error.interceptor.ts`, `core/http/http-context.tokens.ts` |
| Error global | `core/errors/global-error-handler.ts`, `core/errors/index.ts` |
| Analytics strategy | `core/services/analytics/analytics.adapter.ts`, `console.analytics.ts`, `gtag.analytics.ts` |
| Toast provider | `shared/ui/toast/toast.provider.ts`, `toast.service.ts` |

Guion:

1. 0-15 min: abrir servicios HTTP. Explicar una capa por recurso, params tipados y por que el componente no construye URLs.
2. 15-30 min: abrir `ReportService`. Explicar adaptacion pragmaticamente: backend devuelve array o paged/base64 o reporte; front normaliza borde externo.
3. 30-45 min: abrir `authInterceptor`. Explicar `HttpInterceptorFn`, `inject`, request cloning y token signal.
4. 45-60 min: abrir `errorInterceptor`. Explicar manejo centralizado por status, `HttpContext` para saltarse interceptor y rethrow para que el caller aun pueda reaccionar.
5. 60-72 min: abrir `GlobalErrorHandler`. Diferenciar errores HTTP controlados vs errores inesperados de runtime; trackeo solo fuera de dev mode.
6. 72-82 min: abrir `AnalyticsAdapter`. Explicar strategy con clase abstracta + `provideAnalytics()` + `withGtag()`; composable y tree-shakeable porque solo se provee la estrategia elegida.
7. 82-90 min: ejercicio guiado: cambiar provider analytics o agregar nuevo status al map de errores y testear efecto.

Mensajes clave:

- Interceptor maneja protocolo; componente maneja caso de uso.
- `HttpContext` evita banderas globales fragiles.
- Provider functions (`provideX`, `withX`) escalan mejor que configuracion dispersa.
- Strategy por DI permite cambiar implementacion sin cambiar consumidores.

### Testing 1 - Component tests, DOM helpers y CVA

Duracion: 1h 30min.

Objetivo de la sesion: explicar testing unitario de componentes Angular y como testear CVA sin acoplarse a implementacion interna.

Material a mostrar:

| Tema | Archivos |
| ---- | -------- |
| Helpers DOM | `src/app/spec-helpers/element.spec-helper.ts` |
| Input CVA | `shared/ui/form-field/input-field/input-field.component.spec.ts` |
| Select CVA | `shared/ui/form-field/select-field/select-field.component.spec.ts` |
| Select remoto | `shared/components/client-select-field/client-select-field.component.spec.ts` |
| Tabla/paginador | `shared/ui/data-table/data-table.component.spec.ts`, `shared/ui/paginator/paginator.component.spec.ts` |

Guion:

1. 0-15 min: definir niveles. Unit test puro prueba una clase/servicio aislado. Component test renderiza template con `TestBed`. Integration test cruza routing, HTTP, providers o varios componentes reales.
2. 15-25 min: explicar regla del repo: Act, Wait, Assert. Se cambia estado, se espera `fixture.whenStable()`, se afirma DOM o estado.
3. 25-40 min: abrir `element.spec-helper.ts`. Explicar `findEl`, `queryEl`, `findEls`, `click`, `getText`, `dispatchFakeEvent`, y por que `data-testid` baja fragilidad.
4. 40-58 min: abrir `input-field.component.spec.ts`. Mostrar host dummy con `FormControl`, pruebas de `writeValue`, input del usuario, touched, disabled y `aria-invalid`.
5. 58-75 min: abrir `select-field.component.spec.ts`. Mostrar interacciones reales: abrir panel, escoger opcion, buscar, Escape, outputs.
6. 75-90 min: ejercicio guiado: agregar una prueba CVA nueva sin leer propiedades privadas del componente.

Mensajes clave:

- Test de CVA debe observar contrato de Forms, no campos privados.
- Host component dummy da contexto real de Angular Forms.
- Interactuar DOM con helpers mantiene tests legibles.
- `whenStable()` evita flakiness con render async moderno.

### Testing 2 - HTTP, servicios e interceptores

Duracion: 1h 30min.

Objetivo de la sesion: explicar pruebas de integracion liviana para capa HTTP sin levantar backend.

Material a mostrar:

| Tema | Archivos |
| ---- | -------- |
| HTTP helpers | `src/app/spec-helpers/http.spec-helper.ts` |
| Service tests | `core/services/report/report.service.spec.ts`, `client.service.spec.ts`, `account.service.spec.ts` |
| Auth interceptor test | `core/interceptors/auth.interceptor.spec.ts` |
| Error interceptor test | `core/interceptors/error.interceptor.spec.ts` |
| Context token | `core/http/http-context.tokens.ts` |

Guion:

1. 0-10 min: explicar diferencia: no es unit puro, es integracion de servicio/interceptor con Angular HTTP testing backend.
2. 10-25 min: abrir `http.spec-helper.ts`. Explicar `setupHttpService`, `expectRequest`, `expectParams`, `expectMissingParams`, `pagedResponse`.
3. 25-45 min: abrir `report.service.spec.ts`. Mostrar request esperado, params, `req.flush`, normalizacion de respuesta legacy array y PDF base64/reporte.
4. 45-62 min: abrir `auth.interceptor.spec.ts`. Mostrar `provideHttpClient(withInterceptors(...))`, `provideHttpClientTesting`, signal fake de token y assert de header.
5. 62-80 min: abrir `error.interceptor.spec.ts`. Mostrar status 401/403/400/404/409/500/0, spies nombrados, `HttpContext` skip y `httpTesting.verify()`.
6. 80-90 min: ejercicio guiado: agregar un caso 422 o validar que un param opcional no se envie.

Mensajes clave:

- `HttpTestingController` prueba request real de Angular sin red.
- `httpTesting.verify()` cierra fugas de requests pendientes.
- Interceptores se prueban con `provideHttpClient(withInterceptors(...))`, no instanciando funciones a mano.
- Helpers HTTP evitan duplicar boilerplate y hacen que el test lea como especificacion.

### Testing 3 - RouterHarness e integracion de features

Duracion: 1h 30min.

Objetivo de la sesion: probar flujos Angular que dependen de router, guards, input binding de ruta y providers.

Material a mostrar:

| Tema | Archivos |
| ---- | -------- |
| Guards | `core/guards/auth.guard.spec.ts` |
| Login flow | `pages/login/login.component.spec.ts` |
| Edit route | `pages/accounts/edit/account-edit.component.spec.ts`, `pages/clients/edit/client-edit.component.spec.ts` |
| Providers nombrados | specs de pages con `analyticsAdapterSpy`, `toastSpy`, `serviceSpy` |
| Config de specs | `tsconfig.spec.json`, `jest.config.cts` |

Guion:

1. 0-15 min: explicar cuando usar `RouterTestingHarness`: navegacion, guards, redirects, route params, component input binding.
2. 15-35 min: abrir `auth.guard.spec.ts`. Mostrar rutas fake, signal de autenticacion y asserts sobre `Router.url`.
3. 35-55 min: abrir `login.component.spec.ts`. Mostrar navegacion a `/login`, login exitoso, error de auth y mocks nombrados.
4. 55-72 min: abrir `account-edit.component.spec.ts`. Mostrar `withComponentInputBinding`, carga por route param, submit y navegacion de vuelta.
5. 72-82 min: discutir frontera unit vs integracion: si el test necesita router, HTTP backend de Angular o varios componentes reales, ya es integracion de Angular.
6. 82-90 min: ejercicio guiado: agregar prueba de redirect o route param invalido.

Mensajes clave:

- RouterHarness prueba comportamiento de usuario/ruta, no detalles de Router internals.
- Component input binding moderno reduce boilerplate de `ActivatedRoute` mock.
- Providers nombrados son mejores que objetos inline: reseteables, overrideables y legibles.
- Buen testing Angular no es solo instanciar clases; es probar contratos con runtime Angular cuando el contrato depende de Angular.

## Calidad

Backend:

```bash
cd backend
mvn clean test
mvn clean verify
```

Frontend:

```bash
cd frontend/banking-front
npm run format:check
npm run lint
npm test -- --runInBand
npm run build
```
