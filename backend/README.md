# FNP Template Backend

FastAPI backend for fnp-template with PostgreSQL, email/password authentication, JWT sessions, and RBAC.

## Prerequisites

- [uv](https://docs.astral.sh/uv/getting-started/installation/) (Python package manager)
- Docker and Docker Compose
- Git

## Quick Start

The backend is intended to be run with the rest of the stack via Docker Compose from the project root.

```bash
# From the project root
docker compose -f docker/docker-compose.yml up --build
```

The API will be available at http://localhost:8000/docs.

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Endpoint reference**: [docs/API.md](docs/API.md)

## Project Structure

```
backend/
├── app/
│   ├── alembic/              # Database migrations
│   ├── api/
│   │   ├── deps.py           # Dependency injection
│   │   └── v1/routes/        # auth, me, system (roles/users)
│   ├── core/                 # auth, config, exceptions
│   ├── db/                     # SQLAlchemy session
│   ├── domain/permission.py  # RBAC permission strings
│   ├── models/               # User, Role
│   ├── repositories/         # Data access
│   ├── schemas/              # Pydantic models
│   ├── services/             # Business logic
│   └── main.py
├── tests/
└── pyproject.toml
```

## Environment Variables

Copy [`.env.example`](.env.example) to `.env`. Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins (JSON array in prod) |
| `ENVIRONMENT` | `dev`, `stage`, or `prod` |

In production (Cloud Run), `DATABASE_URL` and `SECRET_KEY` are injected via Secret Manager. See [`cloud/cloudbuild.yaml`](../cloud/cloudbuild.yaml).

## Running Tests

```bash
docker compose -f ../docker/docker-compose.test.yml up -d
uv run pytest
```

## Docker (from repo root)

```bash
cp backend/.env.example backend/.env
docker compose -f docker/docker-compose.yml up --build
```



The production container runs as a non-root user, applies Alembic migrations on start, and exposes `/health`.

## Deployment (Google Cloud)

Cloud Build builds the backend image and deploys to Cloud Run. Configure trigger substitutions and Secret Manager secrets as documented in [`cloud/cloudbuild.yaml`](../cloud/cloudbuild.yaml).

Public ingress is enabled (`--allow-unauthenticated`); authentication is enforced by JWT in the API.

## Getting started (fresh database)

1. `docker compose -f docker/docker-compose.yml down -v && docker compose -f docker/docker-compose.yml up --build`
2. `POST /api/v1/auth/bootstrap-system-admin` with `{ email, password, name }`
3. `POST /api/v1/auth/login` with the same credentials

See [docs/API.md](docs/API.md) for the full endpoint reference.

## Troubleshooting

**Database connection fails**

1. Check the container: `docker ps`
2. Logs: `docker compose -f docker-compose-db.yml logs db`
3. Confirm `DATABASE_URL` in `.env`

**Migration issues**

```bash
uv run alembic current
# To reset database, use docker volume rm
```

**Bootstrap / login**

Use `POST /api/v1/auth/bootstrap-system-admin` once on an empty database, then `POST /api/v1/auth/login`. See [docs/API.md](docs/API.md).
