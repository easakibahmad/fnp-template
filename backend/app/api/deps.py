from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.session import get_db
from app.domain.permission import Permission
from app.models.user import User
from app.repositories.role import RoleRepository
from app.repositories.user import UserRepository
from app.services.permission_evaluator import PermissionEvaluator
from app.services.role import RoleService
from app.services.user import UserService

DbSessionDep = Annotated[Session, Depends(get_db)]


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if current_user.is_deleted:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


CurrentActiveUserDep = Annotated[User, Depends(get_current_active_user)]


def get_role_repository(db: DbSessionDep) -> RoleRepository:
    return RoleRepository(db)


def get_user_repository(db: DbSessionDep) -> UserRepository:
    return UserRepository(db)


def get_permission_evaluator(
    role_repo: Annotated[RoleRepository, Depends(get_role_repository)],
) -> PermissionEvaluator:
    return PermissionEvaluator(role_repo)


def get_role_service(
    role_repo: Annotated[RoleRepository, Depends(get_role_repository)],
) -> RoleService:
    return RoleService(role_repo)


def get_user_service(
    user_repo: Annotated[UserRepository, Depends(get_user_repository)],
    role_repo: Annotated[RoleRepository, Depends(get_role_repository)],
) -> UserService:
    return UserService(user_repo, role_repo)


PermissionEvaluatorDep = Annotated[
    PermissionEvaluator, Depends(get_permission_evaluator)
]
RoleServiceDep = Annotated[RoleService, Depends(get_role_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]


def require_permissions(*required: Permission):
    def _check(
        current_user: CurrentActiveUserDep,
        evaluator: PermissionEvaluatorDep,
    ) -> User:
        if not evaluator.has_all_permissions(current_user.roles, list(required)):
            raise HTTPException(status_code=403, detail="Forbidden")
        return current_user

    return _check
