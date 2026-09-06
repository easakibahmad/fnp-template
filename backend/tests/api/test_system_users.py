from fastapi.testclient import TestClient

from app.core.config import settings

API = settings.API_V1_STR


class TestSystemUsers:
    def test_list_users(self, client: TestClient, admin_headers, test_user):
        r = client.get(f"{API}/system/users/", headers=admin_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["meta"]["total"] >= 1
        emails = [u["email"] for u in data["items"]]
        assert test_user.email in emails

    def test_list_users_forbidden(self, client: TestClient, token_headers):
        r = client.get(f"{API}/system/users/", headers=token_headers)
        assert r.status_code == 403

    def test_set_user_roles(self, client: TestClient, admin_headers, test_user):
        r = client.patch(
            f"{API}/system/users/{test_user.id}/roles",
            headers=admin_headers,
            json={"roles": ["viewer"]},
        )
        assert r.status_code == 200
        assert r.json()["roles"] == ["viewer"]

    def test_set_user_roles_invalid_role(
        self, client: TestClient, admin_headers, test_user
    ):
        r = client.patch(
            f"{API}/system/users/{test_user.id}/roles",
            headers=admin_headers,
            json={"roles": ["nonexistent"]},
        )
        assert r.status_code == 400
