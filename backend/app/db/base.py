# Import Base and all models so Alembic autogenerate can detect them.
from app.db.session import Base  # noqa: F401
from app.models.role import Role  # noqa: F401
from app.models.user import User  # noqa: F401
