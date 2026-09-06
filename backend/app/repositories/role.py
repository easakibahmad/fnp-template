from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.role import Role


class RoleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, role_id: UUID) -> Role | None:
        return self.db.query(Role).filter(Role.id == role_id).first()

    def find_by_name(self, role_name: str) -> Role | None:
        return self.db.query(Role).filter(Role.role_name == role_name).first()

    def find_many_by_names(self, role_names: list[str]) -> list[Role]:
        if not role_names:
            return []
        return self.db.query(Role).filter(Role.role_name.in_(role_names)).all()

    def list_all(self) -> list[Role]:
        return self.db.query(Role).order_by(Role.role_name).all()

    def create(self, role: Role) -> Role:
        try:
            self.db.add(role)
            self.db.commit()
            self.db.refresh(role)
        except IntegrityError:
            self.db.rollback()
            raise
        return role

    def save(self, role: Role) -> Role:
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role

    def delete(self, role: Role) -> None:
        self.db.delete(role)
        self.db.commit()
