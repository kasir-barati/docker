# Jager Python - GraphQL API with OpenTelemetry

A production-ready GraphQL Python application featuring distributed tracing with Jaeger, structured logging with correlation IDs, and a complete observability stack.

## Features

- 🚀 **GraphQL API** using Strawberry.
- 🔍 **Distributed Tracing** with OpenTelemetry and Jaeger.
- 📊 **Metrics Collection** with Prometheus.
- 📈 **Visualization** with Grafana.
- 🔗 **Correlation ID** tracking across requests and traces.
- 📝 **Structured Logging** with [structlog](https://www.structlog.org/).

## Project Structure

```
jager-python/
├── src/
│   ├── __init__.py
│   ├── main.py                    # Application entry point
│   ├── config.py                  # Configuration service
│   ├── logger.py                  # Structlog configuration
│   ├── telemetry.py               # OpenTelemetry setup
│   ├── context.py                 # Correlation ID context
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── correlation.py         # Correlation ID middleware
│   └── schema/
│       ├── __init__.py
│       └── query.py               # GraphQL queries
├── Dockerfile
├── compose.yml
├── Makefile
├── pyproject.toml
├── prometheus.yml
└── .env.example
```

## Quick Start

```bash
cp .env.example .env
make init
docker compose up --build -d
```

**Access the services:**

| Service         | URL                           | Description                                      |
| --------------- | ----------------------------- | ------------------------------------------------ |
| **GraphQL API** | http://localhost:8000/graphql | GeaphiQL API playground - Test your queries here |
| **Jaeger UI**   | http://localhost:16686        | View distributed traces                          |
| **Prometheus**  | http://localhost:9090         | Query metrics                                    |
| **Grafana**     | http://localhost:3000         | Dashboards (admin/admin)                         |

## GraphQL Examples

```graphql
query Hello {
  hello(name: "World")
}

query User {
  user(id: 1) {
    id
    name
    email
    active
  }
}

query Users {
  users(limit: 5) {
    id
    name
    email
    active
  }
}

query SystemInfo {
  systemInfo {
    serviceName
    version
    correlationId
    traceId
  }
}
```

## Observability

### Correlation ID

Every request is assigned a unique correlation ID that:

- Can be provided via `correlation-id` header.
- Is automatically generated if not provided.
- Is included in all log entries.
- Is propagated to OpenTelemetry traces.
- Is returned in response headers.

**Example:**

```bash
curl -H "correlation-id: my-custom-id" \
     http://localhost:8000/graphql \
     -d '{"query": "{ hello }"}'
```

### API Usage Logs

Logging is configured once and provides consistent structure:

```python
logger.info("Processing request", user_id=user_id, correlation_id=correlation_id)
```

- Timestamp
- Log level
- Logger name
- Correlation ID
- Trace ID (when available)
- Span ID (when available)
- Custom context

OpenTelemetry traces are exported to Jaeger:

1. Make GraphQL requests.
2. Open Jaeger UI at http://localhost:16686.
3. Select "graphql-api" service.
4. Search for traces by correlation ID or operation name.
5. View detailed span information.

### Metrics

Prometheus collects metrics from:

- Jaeger (tracing metrics).
- Application (when metrics endpoint is exposed).

Access Prometheus at http://localhost:9090 to:

- Set up alerts.
- Run PromQL queries.
- View metrics graphs.

### Dashboards

Grafana provides visualization:

1. Open Grafana at http://localhost:3000.
2. Login with admin/admin.
3. Create dashboards using Prometheus and Jaeger data sources.

### 4. Modular Architecture

- All application code in `src/` directory
- Clear separation of concerns
- Dependency injection pattern
- Type hints throughout

### 5. Correlation ID

Request tracking across services and logs:

- Unique ID per request
- Included in logs and traces
- Helps debugging distributed systems
