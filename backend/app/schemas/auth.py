from pydantic import BaseModel, EmailStr

from app.schemas.user import User as UserSchema


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class BootstrapSystemAdminRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserSchema
