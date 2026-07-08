# Angular Banking Training

Repositorio full-stack para capacitacion Angular. Cada rama `workshop/*` es un snapshot incremental y ejecutable.

## Rama Actual

Este README queda para contexto, ejecucion local y validacion. Usa [WORKSHOP_STAGE.md](WORKSHOP_STAGE.md) para temario/recorrido y [WORKSHOP_THEORY.md](WORKSHOP_THEORY.md) para teoria.

Esta rama 01 incluye dos labs didacticos aislados. No son parte del dominio bancario; existen para explicar Angular moderno antes de construir features mas grandes.

- `/workshop/change-detection`: signals, zoneless, mutaciones asincronas, `markForCheck` y `detectChanges`.
- `/workshop/routing`: rutas hijas, redirect string, `RedirectFunction`, wildcard local, resolver, query params, `routerOutletData` y `withComponentInputBinding()`.

## Ramas

| Rama                                 | Sesion    | Incremento real                                                      |
| ------------------------------------ | --------- | -------------------------------------------------------------------- |
| `workshop/01-shell-routing-signals`  | Angular 1 | Shell, login, rutas lazy, guards, clientes con signals               |
| `workshop/02-ui-cva-forms`           | Angular 2 | UI propia, CVA, formularios, cuentas y movimientos                   |
| `workshop/03-http-errors-analytics`  | Angular 3 | Reportes, interceptores, error global, analytics                     |
| `workshop/04-testing-components-cva` | Testing 1 | Helpers DOM, component tests, CVA tests                              |
| `workshop/05-testing-http-router`    | Testing 2 | HTTP, interceptores, RouterTestingHarness, guards y flows de paginas |

## Ejecucion Local

Backend local NestJS con BD InMemory:

```bash
cd backend/bank-nestjs
npm install
npm run start:dev
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
cd backend/bank-nestjs
npm run typecheck
npm run build
```

## Servicios

| Servicio            | URL                     |
| ------------------- | ----------------------- |
| Backend Bank NestJS | `http://localhost:8080` |

La BD es InMemory y se reinicia al levantar el proceso.
