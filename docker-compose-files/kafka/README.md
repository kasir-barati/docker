# Kafka

- `wurstmeister/kafka:2.13-2.8.1`:
  - Scala version: `2.13`.
  - Kafka version: `2.8.1`.

## Env variables

<dl>
  <dt><code>KAFKA_ADVERTISED_HOST</code></dt>
  <dd><code>kafka</code></dd>
  <dd>Client can reach Kafka at the name kafka inside the Docker network.</dd>
  <dt><code>KAFKA_ZOOKEEPER_CONNECT</code></dt>
  <dd><code>zookeeper:2181</code></dd>
  <dd>How Kafka connects to Zookeeper.</dd>
  <dt><code>KAFKA_LISTENERS</code></dt>
  <dd><code>SASL_PLAINTEXT://:9092</code></dd>
  <dd>Defining a listener for Kafka.</dd>
  <dd>
    <code>SASL_PLAINTEXT</code>
    means that the broker will use Simple Authentication and Security Layer (SASL) without encryption.
  </dd>
  <dt><code>KAFKA_SASL_ENABLED_MECHANISMS</code></dt>
  <dd><code>SCRAM-SHA-256,SCRAM-SHA-512</code></dd>
  <dd>How clients will authenticate.</dd>
  <dd>
    Supports <code>SCRAM-SHA-256</code> and <code>SCRAM-SHA-512</code> for secure authentication.
  </dd>
  <dt><code>KAFKA_LISTENER_SECURITY_PROTOCOL_MAP</code></dt>
  <dd><code>SASL_PLAINTEXT:SASL_PLAINTEXT</code></dd>
  <dd>
    Maps the <code>SASL_PLAINTEXT</code> listener to the <code>SASL_PLAINTEXT</code> security protocol.
  </dd>
  <dt><code>KAFKA_INTER_BROKER_LISTENER_NAME</code></dt>
  <dd><code>SASL_PLAINTEXT</code></dd>
  <dd>
    Communication between Kafka brokers (if you have more than one) should use the <code>SASL_PLAINTEXT</code> protocol.
  </dd>
  <dt><code>KAFKA_ADVERTISED_LISTENERS</code></dt>
  <dd><code>SASL_PLAINTEXT://kafka:9092</code></dd>
  <dd>How to advertise its address to external clients.</dd>
  <dt><code>KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL</code></dt>
  <dd><code>SCRAM-SHA-256</code></dd>
  <dd>
    Specifies the authentication mechanism that Kafka brokers will use to authenticate each other when communicating internally (inter-broker communication).
  </dd>
  <dt><code>KAFKA_OPTS</code></dt>
  <dd><code>-Djava.security.auth.login.config=/app/config/jaas.conf</code></dd>
  <dd>
    Points to a Java Auth Service (JAAS) conf file for Kafka, which defines how SASL should be performed.
  </dd>
</dl>

## Volumes

1. `/var/run/docker.sock:/var/run/docker.sock`:
   - Mounts the Docker socket inside the Kafka container.
   - Necessary for Kafka’s internal communication setup or networking.
2. `./third-party/kafka/jaas.conf:/app/config/jaas.conf`:
   - Necessary for SASL auth.
   - Used in `KAFKA_OPTS` environment variable.

# Zookeeper

A centralized service for maintaining configuration information, naming, providing distributed synchronization, and group services. In kafka we tend to use it primarily for:

- Tracking Kafka brokers (cluster metadata).
- Managing partition assignment and leader election.
- Tracking consumer offsets.

## hostname

- Reachable through this hostname inside the Docker network.

## ulimits

- I had to specify memory limitations for this service because of this error ([ref](https://stackoverflow.com/a/72109503/8784518)):
  ```shell
  library initialization failed - unable to allocate file descriptor table - out of memory/usr/bin/start-zk.sh: line 4:    12 Aborted                 (core dumped) /opt/zookeeper-3.4.13/bin/zkServer.sh start-foreground
  ```
