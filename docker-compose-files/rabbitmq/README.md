> [!TIP]
>
> For more example on how to integrate RabbitMQ in your microservices architecture you can look at my work [here](https://github.com/kasir-barati/nestjs-materials/tree/main/microservices). **If this repo or the other one helped you consider giving them a star :star_struck:.**

# `hostname`

- RabbitMQ stores data based on what it calls the "Node Name" (`hostname`)
- What this means for usage in Docker?
  - We should specify `-h`/`--hostname` explicitly for each daemon so that we don't get a random hostname
  - To be able keep track of our data
- You can learn how to work with topic exchange in NestJS [here](./topic-nestjs/).

# Configure your rabbitmq

- ## shell environment take priority over I guess these two
- `.env` file
  - RabbitMQ Management UI
    - `RABBITMQ_DEFAULT_USER`
      - **Meant to be used in development and CI environments.**
      - The same as `default_user` in `rabbitmq.conf` **but higher priority**.
      - Convenient in cases where providing a config file is impossible, and environment variables is the only way to seed a user.
    - `RABBITMQ_DEFAULT_PASS`
      - **Meant to be used in development and CI environments.**
      - The same as `default_pass` in `rabbitmq.conf` **but higher priority**.
      - Convenient in cases where providing a config file is impossible, and environment variables is the only way to seed a user.
  - `RABBITMQ_DEFAULT_VHOST`
    - In this way we can create multiple virtual host and use them separately
    - **Meant to be used in development and CI environments.**
    - The same as `default_vhost` in `rabbitmq.conf` **but higher priority**.
    - Convenient in cases where providing a config file is impossible, and environment variables is the only way to seed virtual hosts.
  - `RABBITMQ_NODE_IP_ADDRESS`
    - Bind one network interface.
    - Binding to two or more interfaces can be set up in the configuration file.
    - Default: an empty string, meaning "bind to all network interfaces".
  - `RABBITMQ_NODE_PORT`
    - Default: 5672.
  - `RABBITMQ_DIST_PORT`
    - Used for inter-node and CLI tool communication.
    - Ignored if node config file sets `kernel.inet_dist_listen_min` or `kernel.inet_dist_listen_max` keys.
    - Default: `RABBITMQ_NODE_PORT + 20000`
  - `RABBITMQ_DISTRIBUTION_BUFFER_SIZE`
    - Default: 128000
    - In kilobytes.
    - Values lower than `64 MB` are not recommended.
    - Outgoing data buffer size limit (for inter-node communication connections)
  - `RABBITMQ_NODENAME`
    - Node name
    - should be unique per Erlang-node-and-machine combination.
    - Default:
      - Unix: `rabbit@$HOSTNAME`
        - **Recall I what I said [here](#hostname)**
        - And [here](#shell-environment-take-priority-over-i-guess-these-two)
  - `RABBITMQ_CONFIG_FILE`
    - Main config file path.
    - UNIX: `$RABBITMQ_HOME/etc/rabbitmq/rabbitmq.conf`
  - `RABBITMQ_CONFIG_FILES`
    - Path to a directory of RabbitMQ configuration files
    - The files will be loaded in alphabetical order.
    - Prefixing each files with a number is a common practice.
    - UNIX: `$RABBITMQ_HOME/etc/rabbitmq/conf.d`
  - `RABBITMQ_MNESIA_BASE`
    - Where sub-directories for the RabbitMQ server's node database, message store and cluster state files, one for each node.
      - unless `RABBITMQ_MNESIA_DIR` is set explicitly.
    - It is important that effective RabbitMQ user has sufficient permissions to read, write and create files and subdirectories in this directory at any time.
    - **Typically not overridden. Usually `RABBITMQ_MNESIA_DIR` is overridden instead.**
  - `RABBITMQ_MNESIA_DIR`
    - Store RabbitMQ node's data.
      - Schema database
      - Message stores
      - Cluster member information
      - Other persistent node state.
  - `RABBITMQ_CONSOLE_LOG `
    - redirect console output from the server to a file named `%RABBITMQ_SERVICENAME%` in the default `RABBITMQ_BASE` directory.
    - Valid values:
      - `new`: Create new file each time the service starts.
      - `reuse`: Overwrite the existing file each time the service starts.
      - **not set**: console output from the server will be discarded **(default)**.
  - `HOSTNAME`
    - IDK which one, this in `.env` file or `hostname` in docker.
      - Maybe docker override this environmental variable. :idk:
- `rabbitmq.conf` file
  - Main Configuration File
  - In [sysctl format](https://github.com/basho/cuttlefish/wiki/Cuttlefish-for-Application-Users)
    - One setting uses one line
    - Lines are structured `Key = Value`
    - Any line starting with a `#` character is a comment
  - `rabbitmq-env.conf`
    - On UNIX-based systems it is possible to use a file named `rabbitmq-env.conf` to define environment variables that will be used by the broker.
    - Its location is configurable using the `RABBITMQ_CONF_ENV_FILE` environment variable.
