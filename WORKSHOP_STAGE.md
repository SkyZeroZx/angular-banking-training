# Workshop 01 - Shell, Routing y Signals

Esta rama es el primer corte ejecutable del workshop. La app tiene solo login, layout autenticado y listado de clientes con HTML simple.

## Alcance

- Bootstrap standalone con `ApplicationConfig`.
- Rutas lazy con `loadComponent`.
- Guards de acceso publico/privado.
- Layout autenticado con header, sidebar y footer.
- Lista de clientes con `signal`, `computed`, `linkedSignal`, `toSignal` y `toObservable`.
- Tabla HTML simple como UI de lectura.
- Smoke test minimo de arranque.

## Fuera de este corte

- Formularios de creacion/edicion.
- CVA y controles custom.
- UI compartida.
- Reportes.
- Sesiones avanzadas de testing.

## Guion de 1h 30m

1. 0-10 min: dominio y ejecucion local.
2. 10-22 min: `main.ts`, `app.ts` y `app.config.ts`: bootstrap standalone, `provideRouter` y `provideHttpClient`.
3. 22-38 min: `app.routes.ts` y `auth.guard.ts`: login publico, shell protegido y lazy `loadComponent`.
4. 38-52 min: `login.component.ts`: primer reactive form con inputs HTML nativos y submit contra `AuthService`.
5. 52-75 min: `clients.component.ts` y `clients.component.html`: signals, RxJS interop, busqueda y tabla HTML simple.
6. 75-90 min: ejercicio: agregar una columna visible o un filtro simple en `ClientsComponent`.

## Validacion

```bash
cd frontend/banking-front
npm test -- --runInBand
npm run build
```

## Base didactica

- Scaffolding: soporte alto al inicio y retiro gradual.
- "I do, We do, You do": demo, practica guiada y ejercicio corto.
- Orden basado en docs Angular de routing, signals y component testing.
