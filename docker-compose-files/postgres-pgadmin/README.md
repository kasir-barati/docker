# [Q&A](https://forums.docker.com/t/connection-refused-postgres-pgadmin/121911?u=9109679196)

# How to use?

1. `cp .env.example .env`
2. `cp .pgadmin.env.example .pgadmin.env`
3. `cp .postgres.env.example .postgres.env`
4. `mkdir pgdata`
5. `docker-compose up`

## `network_mode: host` is incompatible with port binding

- Just make sure you `80` port is free. Because pgadmin will run on that port
- I cannot map any port to the pgadmin while I am using host network. If you found a solution please share it with me with a PR.

  ```cmd
  ERROR: for xyz  "host" network_mode is incompatible with port_bindings
  ```

- If you use the `docker-compose.yml` you cannot connect to the postgres instance due to what the docker do. Docker create a network for them and put them in that network. Therefore pgadmin cannot connect to the database. I am not sure why. The prev paragraph was my guts words.
