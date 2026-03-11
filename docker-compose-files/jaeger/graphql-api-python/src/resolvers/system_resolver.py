"""System-related GraphQL resolvers."""

import strawberry
from strawberry.types import Info

from src.types.system_info import SystemInfo
from src.utils.context import get_correlation_id
from src.utils.logger import get_logger
from src.utils.telemetry import get_tracer


logger = get_logger(__name__)
tracer = get_tracer(__name__)


@strawberry.type
class SystemResolver:
    """Resolvers for system-related queries"""

    @strawberry.field
    def hello(self, name: str | None = None) -> str:
        """Simple hello world query.

        Args:
            name: Optional name to greet.

        Returns:
            Greeting message.
        """
        correlation_id = get_correlation_id()
        logger.info(
            "Processing hello query", name=name, correlation_id=correlation_id
        )

        with tracer.start_as_current_span("hello_query") as span:
            if correlation_id:
                span.set_attribute("correlation_id", correlation_id)

            if name:
                span.set_attribute("greeting.name", name)
                greeting = f"Hello, {name}!"
            else:
                greeting = "Hello, World!"

            logger.info("Hello query completed", greeting=greeting)
            return greeting

    @strawberry.field
    def system_info(self, info: Info) -> SystemInfo:
        """Get system information including correlation and trace IDs"""
        correlation_id = get_correlation_id()
        logger.info("Fetching system info", correlation_id=correlation_id)

        from opentelemetry import trace

        span = trace.get_current_span()
        trace_id = None

        if span.is_recording():
            span_context = span.get_span_context()
            trace_id = format(span_context.trace_id, "032x")

        return SystemInfo(
            service_name="graphql-api",
            version="0.1.0",
            correlation_id=correlation_id,
            trace_id=trace_id,
        )
