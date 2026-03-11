"""SystemInfo GraphQL object type."""

import strawberry


@strawberry.type
class SystemInfo:
    """System information type."""

    service_name: str
    version: str
    correlation_id: str | None = None
    trace_id: str | None = None
