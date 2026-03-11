"""Main application entry point.

Initializes and runs the GraphQL API with OpenTelemetry tracing.
"""

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from src.middlewares.correlation import CorrelationIdMiddleware
from src.schema import schema
from src.utils.config import Environment, get_settings
from src.utils.logger import get_logger, init_logging
from src.utils.telemetry import init_telemetry, instrument_fastapi


logger = get_logger(__name__)
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application starting up", service="jager-python")
    yield
    logger.info("Application shutting down", service="jager-python")


def create_app() -> FastAPI:
    init_logging(settings)

    logger.info(
        "Initializing application",
        service_name=settings.service_name,
        environment=settings.app_env.value,
        debug=settings.debug,
    )

    init_telemetry(settings)

    logger.info("Telemetry initialized", jaeger_endpoint=settings.jaeger_endpoint)

    app = FastAPI(
        title=settings.service_name,
        description="GraphQL API with Jaeger tracing and OpenTelemetry",
        version="0.1.0",
        debug=settings.debug,
        lifespan=lifespan,
    )

    instrument_fastapi(app)

    app.add_middleware(CorrelationIdMiddleware)

    graphql_app = GraphQLRouter(schema)

    app.include_router(graphql_app, prefix="/graphql")

    @app.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "service": settings.service_name}

    @app.get("/")
    async def root():
        """Root endpoint with API information."""
        return {
            "service": settings.service_name,
            "version": settings.service_version,
            "graphql_endpoint": "/graphql",
            "health_endpoint": "/health",
        }

    logger.info("Application initialized successfully")

    return app


app = create_app()


def main() -> None:
    logger.info(
        "Starting server",
        host=settings.host,
        port=settings.port,
        log_level=settings.log_level.value,
    )

    uvicorn.run(
        "src.main:app",
        host=settings.host,
        port=settings.port,
        log_level=settings.log_level.value.lower(),
        reload=settings.app_env == Environment.DEVELOPMENT,
    )


if __name__ == "__main__":
    main()
