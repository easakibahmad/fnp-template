from app.domain.permission import Permission
from app.repositories.role import RoleRepository


class PermissionEvaluator:
    def __init__(self, role_repo: RoleRepository):
        self.role_repo = role_repo

    def get_permissions_for_roles(self, role_names: list[str]) -> set[Permission]:
        if not role_names:
            return set()

        roles = self.role_repo.find_many_by_names(role_names)
        permissions: set[Permission] = set()
        for role in roles:
            for permission in role.permissions:
                try:
                    permissions.add(Permission(permission))
                except ValueError:
                    continue
        return permissions

    def has_all_permissions(
        self, role_names: list[str], required: list[Permission]
    ) -> bool:
        if not required:
            return True

        permissions = self.get_permissions_for_roles(role_names)
        if Permission.ALL in permissions:
            return True

        return all(p in permissions for p in required)

    def get_permissions_list(self, role_names: list[str]) -> list[Permission]:
        permissions = self.get_permissions_for_roles(role_names)
        return sorted(permissions, key=lambda p: p.value)
