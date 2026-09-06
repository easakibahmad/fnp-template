from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    email: EmailStr | None = None
    name: str | None = None


class UserUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str | None = None


class User(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    email: EmailStr
    name: str
    roles: list[str] = []
    is_deleted: bool = False
    created_at: datetime = Field(alias="createdAt", serialization_alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt", serialization_alias="updatedAt")
