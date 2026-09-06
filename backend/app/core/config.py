import json
from enum import StrEnum
from typing import Any

from loguru import logger
from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_DEV_DB_FALLBACK = "postgresql://postgres:postgres@localhost/app_db"


class Environment(StrEnum):
    DEV = "dev"
    STAGE = "stage"
    PROD = "prod"

    @classmethod
    def from_string(cls, env: str) -> "Environment":
        env_lower = env.lower() if env else "dev"
        if env_lower in ("dev", "development", "local", "testing"):
            return cls.DEV
        if env_lower in ("stage", "staging", "uat", "test"):
            return cls.STAGE
        if env_lower in ("prod", "production"):
            return cls.PROD
        logger.warning(f"Unknown environment '{env}', defaulting to DEV")
        return cls.DEV

    @classmethod
    def is_development(cls, env: str) -> bool:
        return cls.from_string(env) == cls.DEV

    @classmethod
    def is_production(cls, env: str) -> bool:
        return cls.from_string(env) == cls.PROD


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )

    PROJECT_NAME: str = "FNP Template"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = Field(default="fallback-secret-key-for-development")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 10080

    ENVIRONMENT: str = "dev"
    BACKEND_CORS_ORIGINS: str = ""

    DATABASE_URL: str = ""

    @field_validator("BACKEND_CORS_ORIGINS", mode="after")
    def assemble_cors_origins(cls, v: str | list[str], info) -> list[str]:
        env = info.data.get("ENVIRONMENT", "dev")
        if Environment.from_string(env) == Environment.DEV:
            return ["*"]
        if isinstance(v, list):
            return v
        if not v:
            return []
        if "," in v:
            return [o.strip() for o in v.split(",")]
        if v.startswith("["):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [v]
        return [v]

    @model_validator(mode="after")
    def validate_settings(self) -> "Settings":
        if not self.DATABASE_URL:
            logger.warning("No DATABASE_URL set, using development fallback")
            self.DATABASE_URL = _DEV_DB_FALLBACK
        return self

    def log_non_sensitive(self) -> None:
        safe_fields = [
            "PROJECT_NAME",
            "API_V1_STR",
            "ALGORITHM",
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            "REFRESH_TOKEN_EXPIRE_MINUTES",
            "ENVIRONMENT",
            "BACKEND_CORS_ORIGINS",
        ]
        pairs = ", ".join(f"{f}={getattr(self, f)!r}" for f in safe_fields)
        logger.info(f"Settings({pairs})")

    def log_sensitive_status(self) -> None:
        def _mask(v: Any) -> str:
            return "SET" if v else "NOT SET"

        sensitive = {
            "SECRET_KEY": self.SECRET_KEY,
            "DATABASE_URL": self.DATABASE_URL,
        }
        pairs = ", ".join(f"{k}={_mask(v)}" for k, v in sensitive.items())
        logger.info(f"Sensitive: {pairs}")


settings = Settings()
