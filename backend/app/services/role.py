from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.domain.permission import ALL_PERMISSIONS
from app.domain.roles import SYSTEM_ADMIN_ROLE
from app.models.role import Role
from app.repositories.role import RoleRepository


def validate_permissions(permissions: list[str]) -> list[str]:
    invalid = [p for p in permissions if p not in ALL_PERMISSIONS]
    if invalid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid permissions: {', '.join(invalid)}",
        )
    return permissions


class RoleService:
    def __init__(self, repo: RoleRepository):
        self.repo = repo

    def list_roles(self) -> list[Role]:
        return self.repo.list_all()

    def get_by_id(self, role_id: UUID) -> Role:
        role = self.repo.get_by_id(role_id)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )
        return role

    def create(self, role_name: str, permissions: list[str] | None = None) -> Role:
        perms = validate_permissions(permissions or [])
        role = Role(role_name=role_name, permissions=perms)
        try:
            return self.repo.create(role)
        except IntegrityError as e:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A role with this name already exists",
            ) from e

    def update(
        self,
        role_id: UUID,
        role_name: str | None = None,
        permissions: list[str] | None = None,
    ) -> Role:
        role = self.get_by_id(role_id)
        if role_name is not None:
            role.role_name = role_name
        if permissions is not None:
            role.permissions = validate_permissions(permissions)
        try:
            return self.repo.save(role)
        except IntegrityError as e:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A role with this name already exists",
            ) from e

    def delete(self, role_id: UUID) -> None:
        role = self.get_by_id(role_id)
        if role.role_name == SYSTEM_ADMIN_ROLE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot delete built-in system_admin role",
            )
        self.repo.delete(role)
