# Architecture

## Layered architecture

Routes → Services → Repositories:

```
Routes      HTTP, auth guards, request/response
Services    Business logic, orchestration
Repositories SQLAlchemy persistence
```

### Routes (`app/api/v1/routes/`)

- HTTP concerns only; delegate to services via FastAPI dependencies
- RBAC via `require_permissions()` in `app/api/deps.py`
- Router-level `prefix` and `tags` declared on each `APIRouter`

### Services (`app/services/`)

- Business rules; receive repositories via constructor injection
- `PermissionEvaluator` resolves role permissions from DB
- `RoleService`, `UserService` handle RBAC and user operations

### Repositories (`app/repositories/`)

- One repository per model (`UserRepository`, `RoleRepository`)
- Handle commits and SQLAlchemy queries

## RBAC

```
User.roles[]  →  roles table (role_name, permissions[])
                      ↓
              PermissionEvaluator
                      ↓
              require_permissions() on routes
```

- Permission enum: `app/domain/permission.py`
- JWT carries role names; permissions resolved at runtime from DB
- `GET /me/` returns resolved `permissions[]` for clients

## Dependency injection

Use `Annotated` aliases from `app/api/deps.py`:

```python
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
CurrentActiveUserDep = Annotated[User, Depends(get_current_active_user)]

@router.get("/")
def list_users(user_service: UserServiceDep) -> AdminUsersPageResponse:
    ...
```

Blocking sync SQLAlchemy runs in `def` handlers (threadpool), not `async def`.

## Project structure

```
app/
├── api/deps.py              # DbSessionDep, service deps, require_permissions
├── api/v1/routes/
│   ├── auth.py, me.py, users.py, app_version.py
│   └── admin/roles.py, admin/users.py
├── core/auth.py             # JWT
├── domain/permission.py     # Permission StrEnum
├── models/user.py, role.py
├── repositories/user.py, role.py
├── schemas/                 # Pydantic models (auth, user, role, me)
├── services/
│   ├── user.py, role.py
│   └── permission_evaluator.py
├── app/alembic/versions/    # Migrations
└── main.py
```

## Key principles

1. Services never touch raw `db` sessions — use repositories
2. Routes contain no business logic
3. Return types on endpoints; `response_model` only when public schema differs
4. One HTTP operation per function
