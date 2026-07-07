# Backend Bank NestJS

Backport del backend Spring multi-servicio a un solo proyecto NestJS.

Mantiene el contrato HTTP:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/validate?token=...`
- `GET|POST|PUT|PATCH|DELETE /api/clientes`
- `GET|POST|PUT|PATCH|DELETE /api/cuentas`
- `GET|POST|DELETE /api/movimientos`
- `GET /api/reportes`
- `GET /api/reportes/pdf`
- `GET /actuator/health`

La persistencia es InMemory y se reinicia al levantar el proceso.

## Ejecutar

```bash
cd backend/bank-nestjs
npm install
npm run start:dev
```

El monolito escucha en `http://localhost:8080`, igual que el gateway actual.

Login local:

| Usuario | Password |
| --- | --- |
| `admin` | `admin123` |

## Validar build

```bash
npm run build
```

Variables opcionales:

| Variable | Default |
| --- | --- |
| `PORT` | `8080` |
| `JWT_SECRET` | `banking-local-secret-key-for-jwt-token-generation-2024-must-be-at-least-256-bits` |
| `JWT_EXPIRATION_MS` | `3600000` |
| `DAILY_WITHDRAWAL_LIMIT` | `1000` |
