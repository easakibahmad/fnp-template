from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from loguru import logger
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.deps import DbSessionDep
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application...")
    logger.info(f"Environment - {settings.ENVIRONMENT}")
    if settings.ENVIRONMENT.lower() == "dev":
        settings.log_non_sensitive()
        settings.log_sensitive_status()

    from app.db.session import engine

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection established")
    except Exception as e:
        logger.warning(f"Database connection failed: {e}")

    yield

    logger.info("Shutting down application...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=None,
    redoc_url=None,
    lifespan=lifespan,
)

is_dev = settings.ENVIRONMENT.lower() in ["dev", "stage"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if is_dev else settings.BACKEND_CORS_ORIGINS,
    allow_credentials=not is_dev,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
register_exception_handlers(app)


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        title=f"{settings.PROJECT_NAME} - Swagger UI",
    )


@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        title=f"{settings.PROJECT_NAME} - ReDoc",
    )


@app.get("/")
async def root():
    return {"message": "Welcome to the API. See /docs for documentation."}


@app.get("/health", tags=["Health"])
def healthcheck(db: DbSessionDep) -> dict[str, str]:
    """Healthcheck endpoint that verifies API and DB connectivity."""
    db_status = "ok"
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError as e:
        db_status = "error"
        logger.error(f"Database connection error: {e}")
    return {"api": "ok", "db": db_status}
