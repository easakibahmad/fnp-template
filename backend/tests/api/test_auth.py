from fastapi.testclient import TestClient

from app.core.auth import create_token_pair
from app.core.config import settings

API = settings.API_V1_STR

TEST_PASSWORD = "test-password-123"


class TestLogin:
    def test_login_returns_tokens(self, client: TestClient, test_user):
        r = client.post(
            f"{API}/auth/login",
            json={"email": test_user.email, "password": TEST_PASSWORD},
        )
        assert r.status_code == 200
        data = r.json()
        assert data["access_token"]
        assert data["refresh_token"]
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == test_user.email

    def test_login_wrong_password(self, client: TestClient, test_user):
        r = client.post(
            f"{API}/auth/login",
            json={"email": test_user.email, "password": "wrong"},
        )
        assert r.status_code == 401


class TestBootstrapSystemAdmin:
    def test_bootstrap_creates_first_admin(self, client: TestClient):
        r = client.post(
            f"{API}/auth/bootstrap-system-admin",
            json={
                "email": "founder@example.com",
                "password": "bootstrap-pass-1",
                "name": "Founder",
            },
        )
        assert r.status_code == 200
        data = r.json()
        assert data["user"]["email"] == "founder@example.com"
        assert "system_admin" in data["user"]["roles"]

    def test_bootstrap_rejected_when_users_exist(
        self, client: TestClient, test_user
    ):
        r = client.post(
            f"{API}/auth/bootstrap-system-admin",
            json={
                "email": "another@example.com",
                "password": "bootstrap-pass-2",
                "name": "Another",
            },
        )
        assert r.status_code == 403


class TestRefreshToken:
    def test_refresh_returns_new_tokens(self, client: TestClient, test_user):
        _, refresh = create_token_pair(test_user)
        r = client.post(f"{API}/auth/refresh", json={"refresh_token": refresh})
        assert r.status_code == 200
        data = r.json()
        assert data["access_token"]
        assert data["refresh_token"]
        assert data["user"]["id"] == str(test_user.id)

    def test_invalid_token(self, client: TestClient):
        r = client.post(f"{API}/auth/refresh", json={"refresh_token": "garbage"})
        assert r.status_code == 401

    def test_access_token_rejected_as_refresh(self, client: TestClient, test_user):
        access, _ = create_token_pair(test_user)
        r = client.post(f"{API}/auth/refresh", json={"refresh_token": access})
        assert r.status_code == 401
