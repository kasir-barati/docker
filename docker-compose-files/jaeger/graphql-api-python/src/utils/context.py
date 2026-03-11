"""Context management for OTel"""

import uuid
from contextvars import ContextVar


_correlation_id_var: ContextVar[str | None] = ContextVar("correlation_id", default=None)


def generate_correlation_id() -> str:
    """Generate a new correlation ID."""
    return str(uuid.uuid4())


def get_correlation_id() -> str | None:
    """Get the current correlation ID from context."""
    return _correlation_id_var.get()


def set_correlation_id(correlation_id: str) -> None:
    """Set the correlation ID in context."""
    _correlation_id_var.set(correlation_id)


def get_or_create_correlation_id() -> str:
    """Get existing correlation ID or create a new one."""
    correlation_id = get_correlation_id()

    if correlation_id is None:
        correlation_id = generate_correlation_id()
        set_correlation_id(correlation_id)

    return correlation_id
