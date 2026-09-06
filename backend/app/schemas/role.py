from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    role_name: str = Field(alias="roleName", serialization_alias="roleName")
    permissions: list[str]
    created_at: datetime = Field(alias="createdAt", serialization_alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt", serialization_alias="updatedAt")


class RoleCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    role_name: str = Field(alias="roleName")
    permissions: list[str] | None = None


class RoleUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    role_name: str | None = Field(default=None, alias="roleName")
    permissions: list[str] | None = None


class StatusResponse(BaseModel):
    status: str = "ok"
