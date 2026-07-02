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

| Usuario | Password |
| ------- | -------- |
| `admin` | `admin123` |

Servicios locales:

| Servicio | URL |
| -------- | --- |
| API Gateway | `http://localhost:8080` |
| Banking Service | `http://localhost:8090` |
| Auth Service | `http://localhost:8091` |
| H2 Auth | `http://localhost:8091/h2-console` |
| H2 Banking | `http://localhost:8090/h2-console` |

Credenciales H2 locales:

| Campo | Valor |
| ----- | ----- |
| JDBC URL auth | `jdbc:h2:mem:auth-service` |
| JDBC URL banking | `jdbc:h2:mem:banking-service` |
| User | `sa` |
| Password | vacio |

## Seed local

El seed esta activo por defecto con `APP_SEED_ENABLED=true`.

Auth crea el usuario admin:

| Usuario | Password | Rol |
| ------- | -------- | --- |
| `admin` | `admin123` | `ADMIN` |

Banking crea datos minimos para probar la app:

| Cliente | Cliente ID | Cuentas |
| ------- | ---------- | ------- |
| Jose Lema | `client-001` | `478758` |
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

| Variable | Default local | Uso |
| -------- | ------------- | --- |
| `DB_URL` | H2 en memoria | JDBC URL |
| `DB_USERNAME` | `sa` | Usuario DB |
| `DB_PASSWORD` | vacio | Password DB |
| `DB_DRIVER` | `org.h2.Driver` | Driver JDBC |
| `HIBERNATE_DIALECT` | `org.hibernate.dialect.H2Dialect` | Dialecto Hibernate |
| `APP_SEED_ENABLED` | `true` | Seed minimo |
| `JWT_SECRET` | secreto local | Firma JWT |

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
