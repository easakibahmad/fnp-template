from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.api.deps import UserServiceDep, require_permissions
from app.domain.permission import Permission
from app.models.user import User
from app.schemas.admin_user import (
    AdminSetUserRoles,
    AdminUserResponse,
    AdminUsersPageResponse,
    PageMeta,
)
from app.schemas.user import User as UserSchema

router = APIRouter(
    prefix="/system/users",
    tags=["System"],
)


@router.get("/")
def list_users(
    _: Annotated[User, Depends(require_permissions(Permission.USERS_READ))],
    user_service: UserServiceDep,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> AdminUsersPageResponse:
    items, total = user_service.list_users(page=page, limit=limit)
    total_pages = 0 if total == 0 else (total + limit - 1) // limit
    return AdminUsersPageResponse(
        items=[UserSchema.model_validate(user) for user in items],
        meta=PageMeta(page=page, limit=limit, total=total, totalPages=total_pages),
    )


@router.patch("/{user_id}/roles")
def set_user_roles(
    user_id: UUID,
    body: AdminSetUserRoles,
    _: Annotated[User, Depends(require_permissions(Permission.USERS_EDIT))],
    user_service: UserServiceDep,
) -> AdminUserResponse:
    user = user_service.set_roles(user_id=user_id, roles=body.roles)
    return AdminUserResponse.model_validate(user)
