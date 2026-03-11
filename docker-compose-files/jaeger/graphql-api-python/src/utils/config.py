"""Configuration service"""

import tomllib
from enum import StrEnum
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _get_version() -> str:
    """
    Returns version from pyproject.toml.
    """

    pyproject_path = Path(__file__).parent.parent.parent / "pyproject.toml"

    try:
        with open(pyproject_path, "rb") as f:
            pyproject_data = tomllib.load(f)
            return pyproject_data.get("project", {}).get("version", "unknown")
    except Exception:
        return "unknown"


class Environment(StrEnum):
    """Application environment."""

    DEVELOPMENT = "DEVELOPMENT"
    PRODUCTION = "PRODUCTION"
    TESTING = "TESTING"


class LogLevel(StrEnum):
    """Log levels."""

    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    service_name: str = Field(default="graphql-api", description="Service name")
    app_env: Environment = Field(
        default=Environment.DEVELOPMENT, description="Application environment"
    )
    debug: bool = Field(default=False, description="Debug mode")

    # Server
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, ge=1, le=65535, description="Server port")

    # Logging
    log_level: LogLevel = Field(default=LogLevel.INFO, description="Log level")
    log_json: bool = Field(default=False, description="Output logs in JSON format")

    otel_enabled: bool = Field(default=True, description="Enable OpenTelemetry tracing")
    jaeger_endpoint: str = Field(
        default="http://localhost:4318/v1/traces",
        description="Jaeger OTLP endpoint",
    )

    @field_validator("app_env", mode="before")
    @classmethod
    def validate_environment(cls, v: str) -> Environment:
        """Validate and convert environment string to Environment enum."""
        if isinstance(v, Environment):
            return v

        try:
            return Environment(v.upper())
        except ValueError as err:
            valid_values = ", ".join([e.value for e in Environment])
            raise ValueError(
                f"Invalid environment '{v}'. Must be one of: {valid_values}"
            ) from err

    @field_validator("log_level", mode="before")
    @classmethod
    def validate_log_level(cls, v: str) -> LogLevel:
        """Validate and convert log level string to LogLevel enum."""
        if isinstance(v, LogLevel):
            return v

        try:
            return LogLevel(v.upper())
        except ValueError as err:
            valid_values = ", ".join([level.value for level in LogLevel])
            raise ValueError(
                f"Invalid log level '{v}'. Must be one of: {valid_values}"
            ) from err

    @property
    def service_version(self) -> str:
        """Get service version from pyproject.toml."""
        return _get_version()


# Global settings instance
_settings: Settings | None = None


def get_settings() -> Settings:
    """Get the global settings instance"""
    global _settings

    if _settings is None:
        _settings = Settings()

    return _settings

