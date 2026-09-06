from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: UUID, include_deleted: bool = False) -> User | None:
        query = self.db.query(User).filter(User.id == user_id)
        if not include_deleted:
            query = query.filter(User.is_deleted == False)  # noqa: E712
        return query.first()

    def get_by_email(self, email: str, include_deleted: bool = False) -> User | None:
        query = self.db.query(User).filter(User.email == email)
        if not include_deleted:
            query = query.filter(User.is_deleted == False)  # noqa: E712
        return query.first()

    def count_all(self, include_deleted: bool = False) -> int:
        query = self.db.query(User)
        if not include_deleted:
            query = query.filter(User.is_deleted == False)  # noqa: E712
        return query.count()

    def list_paginated(self, page: int, limit: int) -> tuple[list[User], int]:
        query = self.db.query(User).filter(User.is_deleted == False)  # noqa: E712
        total = query.count()
        items = (
            query.order_by(User.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
        return items, total

    def create(self, user: User) -> User:
        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
        except IntegrityError:
            self.db.rollback()
            raise
        return user

    def save(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
