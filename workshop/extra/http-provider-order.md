# Extra - Orden de Providers HTTP

## Orden correcto

```ts
providers: [
  provideHttpClient(withInterceptors([authInterceptor])),
  provideHttpClientTesting(),
];
```

## Por que

`provideHttpClient()` configura features reales del cliente. `provideHttpClientTesting()` reemplaza backend por testing backend.

Si se invierte el orden, el test puede perder configuracion o usar backend incorrecto.

## Regla practica

Primero configuras cliente. Luego reemplazas backend para test.
