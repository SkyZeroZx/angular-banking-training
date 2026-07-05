# Extra - Routing Lab

## Que ensena

`/workshop/routing` es una zona aislada para explicar router sin mezclarlo con clientes, cuentas o movimientos.

## Piezas

- Parent route: `workshop/routing`.
- Child route default: redirect a `overview`.
- Detail route: `detalle/:id`.
- Query param: `mode=input-binding`.
- Resolver: `routingDemoNameResolver`.
- Wildcard local: `**` dentro del lab.
- Outlet context: `routerOutletData`.

## Por que existe

En una app real, no todos estos conceptos aparecen juntos en una sola pantalla. Para workshop conviene tenerlos juntos, porque permite explicar:

- Orden de rutas.
- Diferencia entre route params y query params.
- Cuando usar resolver.
- Como `withComponentInputBinding()` reduce dependencia directa de `ActivatedRoute`.
- Como un wildcard local no reemplaza el wildcard global.

## Variacion para explicar

Una variacion util para mostrar el mismo patron seria una ruta hija `stats/:year` que reciba:

- `year` como input.
- `view` como query param.
- `title` desde `data`.

La idea didactica es contrastar `ActivatedRoute` con `withComponentInputBinding()` sin convertirlo en una tarea para resolver durante la sesion.
