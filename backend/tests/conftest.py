import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.auth import create_access_token
from app.core.security import hash_password
from app.db.session import Base, get_db
from app.domain.permission import Permission
from app.domain.roles import SYSTEM_ADMIN_ROLE
from app.main import app
from app.models.role import Role
from app.models.user import User

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql://test:test@localhost:5433/test_db",
)

TEST_PASSWORD = "test-password-123"


@pytest.fixture(scope="session")
def db_engine():
    """Create tables in the test database and return the engine."""
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture(scope="function")
def db(db_engine) -> Session:
    """
    Yield a session wrapped in a transaction that is rolled back after each test,
    so every test starts with a clean slate without DROP/CREATE overhead.
    """
    connection = db_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    yield session

    session.close()
    if transaction.is_active:
        transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db) -> TestClient:
    """TestClient with the DB session overridden to use the test transaction."""

    def _override():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _override
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def system_admin_role(db) -> Role:
    role = Role(role_name=SYSTEM_ADMIN_ROLE, permissions=[Permission.ALL.value])
    db.add(role)
    db.flush()
    return role


@pytest.fixture()
def viewer_role(db) -> Role:
    role = Role(role_name="viewer", permissions=[Permission.USERS_READ.value])
    db.add(role)
    db.flush()
    return role


@pytest.fixture()
def test_user(db, viewer_role) -> User:
    user = User(
        id=uuid.uuid4(),
        name="Test User",
        email="test@example.com",
        password_hash=hash_password(TEST_PASSWORD),
        roles=[viewer_role.role_name],
    )
    db.add(user)
    db.flush()
    return user


@pytest.fixture()
def admin_user(db, system_admin_role) -> User:
    user = User(
        id=uuid.uuid4(),
        name="System Admin",
        email="admin@example.com",
        password_hash=hash_password(TEST_PASSWORD),
        roles=[system_admin_role.role_name],
    )
    db.add(user)
    db.flush()
    return user


@pytest.fixture()
def other_user(db, viewer_role) -> User:
    user = User(
        id=uuid.uuid4(),
        name="Other User",
        email="other@example.com",
        password_hash=hash_password(TEST_PASSWORD),
        roles=[viewer_role.role_name],
    )
    db.add(user)
    db.flush()
    return user


@pytest.fixture()
def token_headers(test_user) -> dict[str, str]:
    token = create_access_token(test_user)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin_headers(admin_user) -> dict[str, str]:
    token = create_access_token(admin_user)
    return {"Authorization": f"Bearer {token}"}
