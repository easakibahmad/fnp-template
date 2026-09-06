from fastapi.testclient import TestClient

from app.core.config import settings
from app.domain.roles import SYSTEM_ADMIN_ROLE

API = settings.API_V1_STR


class TestSystemRoles:
    def test_list_roles(self, client: TestClient, admin_headers, system_admin_role):
        r = client.get(f"{API}/system/roles/", headers=admin_headers)
        assert r.status_code == 200
        names = [item["roleName"] for item in r.json()]
        assert SYSTEM_ADMIN_ROLE in names

    def test_list_roles_forbidden(self, client: TestClient, token_headers):
        r = client.get(f"{API}/system/roles/", headers=token_headers)
        assert r.status_code == 403

    def test_create_role(self, client: TestClient, admin_headers):
        r = client.post(
            f"{API}/system/roles/",
            headers=admin_headers,
            json={"roleName": "billing", "permissions": ["SettingsRead"]},
        )
        assert r.status_code == 201
        assert r.json()["roleName"] == "billing"

    def test_get_role(self, client: TestClient, admin_headers, system_admin_role):
        role_id = str(system_admin_role.id)
        r = client.get(f"{API}/system/roles/{role_id}", headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["roleName"] == SYSTEM_ADMIN_ROLE

    def test_update_role(self, client: TestClient, admin_headers, viewer_role):
        r = client.patch(
            f"{API}/system/roles/{viewer_role.id}",
            headers=admin_headers,
            json={"permissions": ["UsersRead", "RolesRead"]},
        )
        assert r.status_code == 200
        perms = r.json()["permissions"]
        assert "RolesRead" in perms

    def test_delete_builtin_role_forbidden(
        self, client: TestClient, admin_headers, system_admin_role
    ):
        r = client.delete(
            f"{API}/system/roles/{system_admin_role.id}",
            headers=admin_headers,
        )
        assert r.status_code == 409

    def test_delete_custom_role(self, client: TestClient, admin_headers, viewer_role):
        r = client.delete(
            f"{API}/system/roles/{viewer_role.id}",
            headers=admin_headers,
        )
        assert r.status_code == 200
