# FNP Template Frontend

Next.js 16 (App Router, Turbopack) + Tailwind CSS v4. Operations pages use mock data by default; auth and Access Control use the real backend API.

## Quick start

```bash
# From repo root — start full stack
docker compose -f ../docker/docker-compose.yml down -v && docker compose -f ../docker/docker-compose.yml up --build
```

Then bootstrap the first system admin (once only):

```bash
curl -X POST http://localhost:8000/api/v1/auth/bootstrap-system-admin \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"your-password","name":"System Admin"}'
```

Open http://localhost:3000 — you can sign in two ways:

1. **Demo accounts** (Avery, Casey, Sarah) — one-click mock UI with role-specific page access. No backend required.
2. **Email/password** — use your bootstrapped system admin to test Access Control at `/admin/access`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

## Environment

Copy [`.env.example`](./.env.example) to `.env.local` when running frontend standalone:

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCK` | `true` | Mock data for ops pages (patients, schedule, etc.) |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000/api/v1` | Backend URL for browser config |
| `API_BASE_URL` | (optional) | Server-side API URL (`http://api:8000/api/v1` in Docker) |

## API sections (backend)

| Section | Endpoints | Purpose |
|---------|-----------|---------|
| **Auth** | `/auth/login`, `/auth/refresh`, `/auth/bootstrap-system-admin` | Sign in and bootstrap |
| **Me** | `GET/PATCH/DELETE /me` | Your own account |
| **System** | `/system/roles`, `/system/users` | Role and user management |

## Access Control portal

Route: `/admin/access` — requires backend `RolesRead` permission (included in `system_admin` role).

- **Roles** tab — CRUD roles and permission matrix
- **User access** tab — assign role names to users

Sidebar shows **Access control** when signed-in user has `RolesRead`.

## Auth flow

### Demo login (mock UI)

1. Pick Avery (admin), Casey (care manager), or Sarah (nurse) on the login page
2. Session cookie only — no JWT, no backend call
3. Sidebar and pages filter by demo role (`ROLE_ACCESS`)
4. Access Control link appears for demo admin but requires real login to load data

### Real login (backend)

1. Login form submits email + password
2. Server action calls `POST /auth/login`
3. JWT stored in httpOnly cookies; session hydrated from `GET /me`
4. Full ops UI (no demo role scoping); Access Control when user has `RolesRead`

Logout clears cookies (no API call).

## Layout

```
src/
├── app/
│   ├── (authed)/       Ops pages (mock data)
│   ├── (admin)/        Access Control portal
│   └── login/          Demo picker + email/password sign-in
├── lib/
│   ├── api/            auth, me, system/roles, system/users
│   ├── auth.ts         Session types and permission helpers
│   └── services/       Mock ops data layer
└── proxy.ts            Redirect unauthenticated users to /login
```
