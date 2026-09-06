from fastapi import APIRouter

from app.api.v1.routes import auth, me
from app.api.v1.routes.system import roles as system_roles
from app.api.v1.routes.system import users as system_users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(me.router)
api_router.include_router(system_roles.router)
api_router.include_router(system_users.router)
