# Jaeger

- CNCF graduated project.
- Open-source e2e distributed tracing.
- Track & trace application requests (usage-aware observability).
- Builtin integration with Kubernetes.
- It supports:
  - Distributed context propagation.
  - Monitor and troubleshoot your distributed systems.
  - Root cause analysis for performance bottlenecks & errors.
  - Latency optimization insights.
  - Service dependency analysis (gives you better understanding of your architecture).
  - Cassandra, ElasticSearch and many more.
  - OpenTelemetry.

## Core Concepts

- **Trace**: complete journey of a request through all services.
- **Span**: single operation/action withing a trace with timing data (AKA how long it took):
  - Operation/action: things like database query, or external API calls.
- **Context**: Propagated metadata across services:
  - Use things like correlation ID or request ID for this.

## Architecture

- **Client**:
  - 3rd party libs I have in my app which emit spans from my application.
  - The instrumentation packages in a NestJS/NodeJS app are usually loaded when you call `getNodeAutoInstrumentations()`, exported from `@opentelemetry/auto-instrumentations-node`.
  - Or `new GraphQLInstrumentation(...)` exported from `@opentelemetry/instrumentation-graphql`.
    - This instrumentation creates **spans for GraphQL operations/resolvers** (depending on config).
- **Agent**:
  - Network daemon.
  - Batches spans to the _collector_.
- **Collector**:
  - Basically the guy responsible for storing data in database.
  - It also validates data before storing it.
- **Storage**:
  - Backend database.
  - Can be Cassandra, ElasticSearch (learn more [here](https://www.jaegertracing.io/docs/1.76/features/#multiple-storage-backends)).

## Best Practices

- Use adaptive sampling strategies to control trace volume. 
  - This way we capture representative data. 
  - If we trace each individual requests we'll have:
    - Massive amount of data.
    - Low performance.
- Add meaningful tags/logs to each span.
  - This is about context.
  - It is easier to diagnose a problem with a good context.
  - It can be things like correlation ID, user ID, important business data.
- Keep an eye on how much memory, cpu and storage Jaeger is using.
- Make sure Jaeger UI is secure and only users who should have access to it can open its UI.

## Adding Jaeger to your App

- Instrument your app (AKA instrumentation), you can find an example [here](./graphql-api-python/README.md).
- Simply put it means adding Jaeger client libs to your app to generate traces.
