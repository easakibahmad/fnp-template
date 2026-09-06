from fastapi import APIRouter, HTTPException, status

from app.api.deps import RoleServiceDep, UserServiceDep
from app.core.auth import create_token_pair, verify_token
from app.schemas.auth import (
    BootstrapSystemAdminRequest,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
)
from app.schemas.user import User as UserSchema

router = APIRouter(prefix="/auth", tags=["Auth"])


def _token_response(user) -> TokenResponse:
    access_token, refresh_token = create_token_pair(user)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserSchema.model_validate(user),
    )


@router.post("/login")
def login(
    body: LoginRequest,
    user_service: UserServiceDep,
) -> TokenResponse:
    user = user_service.authenticate(body.email, body.password)
    return _token_response(user)


@router.post("/bootstrap-system-admin")
def bootstrap_system_admin(
    body: BootstrapSystemAdminRequest,
    user_service: UserServiceDep,
) -> TokenResponse:
    user = user_service.bootstrap_system_admin(
        email=body.email,
        password=body.password,
        name=body.name,
    )
    return _token_response(user)


@router.post("/refresh")
def refresh_access_token(
    request_body: RefreshTokenRequest,
    user_service: UserServiceDep,
) -> TokenResponse:
    """Get a new access token using a refresh token."""
    try:
        payload = verify_token(request_body.refresh_token, token_type="refresh")
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        user = user_service.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or deleted",
            )

        return _token_response(user)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not refresh token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
