from app.domain.permission import Permission
from app.domain.roles import SYSTEM_ADMIN_ROLE
from app.models.role import Role
from app.repositories.role import RoleRepository
from app.services.permission_evaluator import PermissionEvaluator


class TestPermissionEvaluator:
    def test_returns_false_when_required_permissions_missing(self, db, viewer_role):
        evaluator = PermissionEvaluator(RoleRepository(db))
        assert (
            evaluator.has_all_permissions(
                [viewer_role.role_name],
                [Permission.USERS_READ, Permission.USERS_CREATE],
            )
            is False
        )

    def test_treats_wildcard_as_all_permissions(self, db, system_admin_role):
        evaluator = PermissionEvaluator(RoleRepository(db))
        assert (
            evaluator.has_all_permissions(
                [SYSTEM_ADMIN_ROLE],
                [Permission.ROLES_DELETE],
            )
            is True
        )

    def test_empty_required_permissions_returns_true(self, db):
        evaluator = PermissionEvaluator(RoleRepository(db))
        assert evaluator.has_all_permissions(["viewer"], []) is True
        assert evaluator.has_all_permissions([], [Permission.USERS_READ]) is False

    def test_unions_permissions_from_multiple_roles(self, db, viewer_role):
        db.add(
            Role(
                role_name="editor",
                permissions=[Permission.USERS_READ.value, Permission.USERS_EDIT.value],
            )
        )
        db.flush()
        evaluator = PermissionEvaluator(RoleRepository(db))
        permissions = evaluator.get_permissions_for_roles(
            [viewer_role.role_name, "editor"]
        )
        assert Permission.USERS_READ in permissions
        assert Permission.USERS_EDIT in permissions
