from datetime import datetime
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.security import hash_password, verify_password
from app.domain.permission import Permission
from app.domain.roles import SYSTEM_ADMIN_ROLE
from app.models.role import Role
from app.models.user import User
from app.repositories.role import RoleRepository
from app.repositories.user import UserRepository
from app.schemas.user import UserUpdate


class UserService:
    def __init__(self, repo: UserRepository, role_repo: RoleRepository | None = None):
        self.repo = repo
        self.role_repo = role_repo

    def get_by_id(self, user_id: UUID, include_deleted: bool = False) -> User | None:
        return self.repo.get_by_id(user_id, include_deleted=include_deleted)

    def list_users(self, page: int = 1, limit: int = 20) -> tuple[list[User], int]:
        return self.repo.list_paginated(page=page, limit=limit)

    def has_any_user(self) -> bool:
        return self.repo.count_all() > 0

    def authenticate(self, email: str, password: str) -> User:
        normalized = email.strip().lower()
        user = self.repo.get_by_email(normalized)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        return user

    def bootstrap_system_admin(
        self, email: str, password: str, name: str
    ) -> User:
        if self.has_any_user():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bootstrap already completed",
            )
        if not self.role_repo:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Role repository not configured",
            )

        role = self.role_repo.find_by_name(SYSTEM_ADMIN_ROLE)
        if not role:
            role = self.role_repo.create(
                Role(
                    role_name=SYSTEM_ADMIN_ROLE,
                    permissions=[Permission.ALL.value],
                )
            )

        user = User(
            name=name.strip(),
            email=email.strip().lower(),
            password_hash=hash_password(password),
            roles=[role.role_name],
        )
        try:
            return self.repo.create(user)
        except IntegrityError as e:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            ) from e

    def set_roles(self, user_id: UUID, roles: list[str]) -> User:
        user = self.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The user with this id does not exist",
            )
        if self.role_repo:
            for role_name in roles:
                if not self.role_repo.find_by_name(role_name):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Role not found: {role_name}",
                    )
        user.roles = roles
        return self.repo.save(user)

    def update(self, user: User, user_in: UserUpdate) -> User:
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        return self.repo.save(user)

    def soft_delete(self, user: User) -> User:
        if user.is_deleted:
            return user
        user.is_deleted = True
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        user.email = f"deleted_{user.email}@{timestamp}"
        return self.repo.save(user)
