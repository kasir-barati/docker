"""
Correlation ID middleware for request tracking.
"""

from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from src.utils.context import generate_correlation_id, set_correlation_id
from src.utils.logger import get_logger
from src.utils.telemetry import add_correlation_id_to_span


logger = get_logger(__name__)

CORRELATION_ID_HEADER = "correlation-id"


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Middleware to handle correlation ID for request tracking."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and inject correlation ID.
        """
        # Extract correlation ID from header or generate new one
        correlation_id = request.headers.get(
            CORRELATION_ID_HEADER.lower(), request.headers.get(CORRELATION_ID_HEADER)
        )

        if not correlation_id:
            logger.debug("Generated new correlation ID", correlation_id=correlation_id)
            correlation_id = generate_correlation_id()

        set_correlation_id(correlation_id)
        add_correlation_id_to_span(correlation_id)

        response = await call_next(request)

        response.headers[CORRELATION_ID_HEADER] = correlation_id

        return response
