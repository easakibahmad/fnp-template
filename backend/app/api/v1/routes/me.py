from fastapi import APIRouter, status

from app.api.deps import CurrentActiveUserDep, PermissionEvaluatorDep, UserServiceDep
from app.schemas.me import MeResponse
from app.schemas.user import User as UserSchema
from app.schemas.user import UserUpdate

router = APIRouter(prefix="/me", tags=["Me"])


def build_me_response(user, evaluator: PermissionEvaluatorDep) -> MeResponse:
    permissions = evaluator.get_permissions_list(user.roles)
    return MeResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        roles=user.roles,
        permissions=permissions,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


@router.get("/")
def read_me(
    current_user: CurrentActiveUserDep,
    evaluator: PermissionEvaluatorDep,
) -> MeResponse:
    return build_me_response(current_user, evaluator)


@router.patch("/")
def update_me(
    user_in: UserUpdate,
    current_user: CurrentActiveUserDep,
    user_service: UserServiceDep,
) -> UserSchema:
    return UserSchema.model_validate(
        user_service.update(user=current_user, user_in=user_in)
    )


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    current_user: CurrentActiveUserDep,
    user_service: UserServiceDep,
) -> None:
    user_service.soft_delete(user=current_user)
