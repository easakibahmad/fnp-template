# FNP Template

Starter template for full-stack applications with FastAPI, Next.js, and PostgreSQL. Features a fully functional backend with JWT authentication and an admin portal frontend for managing users and roles.

## Layout

```
fnp-template/
├── frontend/   Next.js 16 app (UI + authentication + RBAC admin portal)
└── backend/    FastAPI API (PostgreSQL, JWT auth, RBAC)
```

## Quick start (frontend only)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`. You can sign in using a bootstrapped system admin account (see backend documentation for setup).

See [`frontend/README.md`](frontend/README.md) for development details.

## Quick start (full stack with Docker)

```bash
cp backend/.env.example backend/.env
docker compose -f docker/docker-compose.yml up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API docs | http://localhost:8000/docs |
| PostgreSQL | internal only (`docker compose -f docker/docker-compose.yml exec db psql -U postgres -d app_db`) |

To use different host ports, copy [`.env.docker.example`](.env.docker.example) to `.env` and edit `API_HOST_PORT` / `FRONTEND_HOST_PORT`.

The frontend connects to the backend API container for authentication, users, and RBAC. The API container swagger docs are available at http://localhost:8000/docs.

If migrations fail on first boot (stale DB volume), reset and retry:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build
```


See [`backend/README.md`](backend/README.md) for API details, tests, and deployment.
