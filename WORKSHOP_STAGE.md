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
2. 10-25 min: `app.config.ts` y providers globales.
3. 25-40 min: `app.routes.ts`, lazy loading y guards.
4. 40-60 min: `clients.component.ts` y estado reactivo local.
5. 60-75 min: `DataTableComponent` y paginacion como contrato UI.
6. 75-90 min: ejercicio: agregar un filtro visible o cambiar page size.

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
