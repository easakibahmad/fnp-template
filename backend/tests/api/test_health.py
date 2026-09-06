from fastapi.testclient import TestClient


class TestRootAndDocs:
    def test_root(self, client: TestClient):
        r = client.get("/")
        assert r.status_code == 200
        assert "docs" in r.json()["message"].lower()

    def test_docs(self, client: TestClient):
        r = client.get("/docs")
        assert r.status_code == 200
        assert "text/html" in r.headers["content-type"]

    def test_redoc(self, client: TestClient):
        r = client.get("/redoc")
        assert r.status_code == 200
        assert "text/html" in r.headers["content-type"]


class TestHealth:
    def test_healthcheck(self, client: TestClient):
        r = client.get("/health")
        assert r.status_code == 200
        data = r.json()
        assert data["api"] == "ok"
        assert data["db"] == "ok"
