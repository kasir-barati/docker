"""OpenTelemetry and Jaeger tracing configuration.

Configures distributed tracing with correlation ID propagation.
"""

from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from .config import Settings


def init_telemetry(settings: Settings) -> None:
    """Initialize OpenTelemetry tracing"""
    if not settings.otel_enabled:
        return

    resource = Resource.create(
        {
            "service.name": settings.service_name,
            "service.version": settings.service_version,
            "deployment.environment": settings.app_env.value,
        }
    )
    tracer_provider = TracerProvider(resource=resource)
    otlp_exporter = OTLPSpanExporter(
        endpoint=settings.jaeger_endpoint,
        timeout=30,
    )
    span_processor = BatchSpanProcessor(otlp_exporter)
    tracer_provider.add_span_processor(span_processor)

    # Set the global tracer provider
    trace.set_tracer_provider(tracer_provider)


def instrument_fastapi(app: FastAPI) -> None:
    """
    Instrument FastAPI application with OpenTelemetry.
    """
    FastAPIInstrumentor.instrument_app(app)


def add_correlation_id_to_span(correlation_id: str) -> None:
    """Add correlation ID as attribute to current span."""
    span = trace.get_current_span()

    if span.is_recording():
        span.set_attribute("correlation_id", correlation_id)


def get_tracer(name: str) -> trace.Tracer:
    """Get a tracer instance."""
    return trace.get_tracer(name)
