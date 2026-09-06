# API Documentation

Interactive docs: http://localhost:8000/docs

The API is organized into three sections:

| Section | Prefix | Purpose |
|---------|--------|---------|
| **Auth** | `/api/v1/auth` | Login, refresh, one-time bootstrap |
| **Me** | `/api/v1/me` | Current signed-in user |
| **System** | `/api/v1/system` | RBAC management (roles + users) |

---

## Auth (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Sign in with `{ email, password }` → JWT tokens |
| POST | `/auth/refresh` | No | Exchange refresh token for new token pair |
| POST | `/auth/bootstrap-system-admin` | No | Create first system admin (only when zero users exist) |

**Bootstrap request:**

```json
{
  "email": "admin@example.com",
  "password": "your-secure-password",
  "name": "System Admin"
}
```

Creates the `system_admin` role with `*` permissions and the first user.

All auth endpoints return `TokenResponse`: `access_token`, `refresh_token`, `token_type`, `user`.

---

## Me (`/api/v1/me`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me/` | Bearer | Profile with `roles` and resolved `permissions` |
| PATCH | `/me/` | Bearer | Update own profile (`name`) |
| DELETE | `/me/` | Bearer | Soft-delete own account (not logout) |

Logout is client-side: discard JWT cookies. No API call required.

---

## System roles (`/api/v1/system/roles`)

Requires JWT and permission guards.

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/system/roles/` | `RolesRead` |
| GET | `/system/roles/{id}` | `RolesRead` |
| POST | `/system/roles/` | `RolesCreate` |
| PATCH | `/system/roles/{id}` | `RolesEdit` |
| DELETE | `/system/roles/{id}` | `RolesDelete` |

Built-in role `system_admin` cannot be deleted.

---

## System users (`/api/v1/system/users`)

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/system/users/` | `UsersRead` |
| PATCH | `/system/users/{id}/roles` | `UsersEdit` |

---

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API and database health check |

---

## Authorization

- JWT Bearer token on protected routes
- Permission strings: `UsersRead`, `RolesCreate`, `*`, etc.
- Wildcard `*` grants all permissions
- Multiple required permissions use AND logic

## Error responses

| Status | Meaning |
|--------|---------|
| 401 | Missing/invalid token or wrong password |
| 403 | Insufficient permissions or bootstrap already done |
| 404 | Resource not found |
| 409 | Conflict (duplicate role name, delete system_admin) |
| 422 | Validation error |

---

## Getting started

1. Reset database: `docker compose -f ../docker/docker-compose.yml down -v && docker compose -f ../docker/docker-compose.yml up --build`
2. Bootstrap: `POST /api/v1/auth/bootstrap-system-admin`
3. Login: `POST /api/v1/auth/login`
4. Open frontend at http://localhost:3000 and sign in
5. Manage roles/users at `/admin/access` (requires `RolesRead`)
