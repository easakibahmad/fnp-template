from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import User


class AdminSetUserRoles(BaseModel):
    roles: list[str]


class PageMeta(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int = Field(alias="totalPages", serialization_alias="totalPages")

    model_config = ConfigDict(populate_by_name=True)


class AdminUsersPageResponse(BaseModel):
    items: list[User]
    meta: PageMeta


class AdminUserResponse(User):
    model_config = ConfigDict(from_attributes=True)
