from fastapi.testclient import TestClient

from app.core.config import settings

API = settings.API_V1_STR


class TestMe:
    def test_read_me(self, client: TestClient, token_headers, test_user):
        r = client.get(f"{API}/me/", headers=token_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == test_user.email
        assert "permissions" in data

    def test_update_me(self, client: TestClient, token_headers):
        r = client.patch(
            f"{API}/me/",
            headers=token_headers,
            json={"name": "Updated Name"},
        )
        assert r.status_code == 200
        assert r.json()["name"] == "Updated Name"

    def test_delete_me(self, client: TestClient, token_headers, test_user):
        r = client.delete(f"{API}/me/", headers=token_headers)
        assert r.status_code == 204

        r2 = client.get(f"{API}/me/", headers=token_headers)
        assert r2.status_code == 401

    def test_unauthenticated(self, client: TestClient):
        r = client.get(f"{API}/me/")
        assert r.status_code == 403
