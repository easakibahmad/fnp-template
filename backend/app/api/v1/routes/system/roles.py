from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.api.deps import RoleServiceDep, require_permissions
from app.domain.permission import Permission
from app.models.user import User
from app.schemas.role import RoleCreate, RoleResponse, RoleUpdate, StatusResponse

router = APIRouter(
    prefix="/system/roles",
    tags=["System"],
)


@router.get("/")
def list_roles(
    _: Annotated[User, Depends(require_permissions(Permission.ROLES_READ))],
    role_service: RoleServiceDep,
) -> list[RoleResponse]:
    roles = role_service.list_roles()
    return [RoleResponse.model_validate(role) for role in roles]


@router.get("/{role_id}")
def get_role(
    role_id: UUID,
    _: Annotated[User, Depends(require_permissions(Permission.ROLES_READ))],
    role_service: RoleServiceDep,
) -> RoleResponse:
    role = role_service.get_by_id(role_id)
    return RoleResponse.model_validate(role)


@router.post("/", status_code=201)
def create_role(
    role_in: RoleCreate,
    _: Annotated[User, Depends(require_permissions(Permission.ROLES_CREATE))],
    role_service: RoleServiceDep,
) -> RoleResponse:
    role = role_service.create(
        role_name=role_in.role_name,
        permissions=role_in.permissions,
    )
    return RoleResponse.model_validate(role)


@router.patch("/{role_id}")
def update_role(
    role_id: UUID,
    role_in: RoleUpdate,
    _: Annotated[User, Depends(require_permissions(Permission.ROLES_EDIT))],
    role_service: RoleServiceDep,
) -> RoleResponse:
    role = role_service.update(
        role_id=role_id,
        role_name=role_in.role_name,
        permissions=role_in.permissions,
    )
    return RoleResponse.model_validate(role)


@router.delete("/{role_id}")
def delete_role(
    role_id: UUID,
    _: Annotated[User, Depends(require_permissions(Permission.ROLES_DELETE))],
    role_service: RoleServiceDep,
) -> StatusResponse:
    role_service.delete(role_id)
    return StatusResponse()
