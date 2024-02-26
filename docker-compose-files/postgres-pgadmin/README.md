# How to connect to you DB in your pgadmin4?

1. Add New Server
2. Give it a name (It can be anything)
3. Go to the second tab (Connection)
4. Enter your service name in the “Host name/address” text box -- In our case `postgres`.
   ```yml
   # ...
   services:
     postgres:
   # ...
   ```
   You need to use it also in your codebase to connect to it
5. Now enter your `POSTGRES_PASSWORD` as the “Maintenance database” and `POSTGRES_DB` as the “Password” and `POSTGRES_USER` as the “Username”

# How to use?

1. `cp .env.example .env`
2. `mkdir pgdata`
3. `docker-compose up`

## `network_mode: host` is incompatible with port binding

- Just make sure your `80` (and `PGADMIN_EXPOSED_PORT` in case `docker-compose.yml`) port is free. Because PgAdmin will run on that port.
- I cannot map any port to the PgAdmin while I am using host network. If you found a solution please share it with me with a PR.

  ```cmd
  ERROR: for xyz  "host" network_mode is incompatible with port_bindings
  ```

- If you use the `docker-compose.yml` you cannot connect to the PostgreSQL instance due to what the docker do. Docker create a network for them and put them in that network. Therefore PgAdmin cannot connect to the database. I am not sure why. The prev paragraph was my guts words.
