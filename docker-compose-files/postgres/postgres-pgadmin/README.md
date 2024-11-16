# How to use?

1. `cp .env.example .env`.
2. `docker compose up -d`.

# How to connect to you DB in your pgadmin4?

> [!TIP]
>
> Does not matter how many times you:
>
> - Restart your container (`docker compose up`).
> - Delete and run it again (`docker compose down && docker compose up -d`).
>
> It is not gonna pick up on changes made in `configs.json` or top-level `config` section in your `compose.yml` file. The only way for pgadmin to see new changes is losing its memory (volumes), delete the containers alongside their volumes: `docker compose down -v`. Of course you only need to delete the volumes assigned to your pgadmin (i.e. `pgadmin`).

## Using `servers.json` config file

- The most easiest way to do this.
- It configures your server connection to your DB automatically for you.
- There are certain limitations. learn more here: https://github.com/pgadmin-org/pgadmin4/issues/8117#issuecomment-2469921653.
- Documented here: https://www.pgadmin.org/docs/pgadmin4/latest/container_deployment.html#mapped-files-and-directories.
- You can also pre-configure things like theme to dark if you like through `preferences.json` but it is not working for me. Learn about its schema here: https://www.pgadmin.org/docs/pgadmin4/latest/preferences.html#updating-preferences-preferences-json.
- You can see `servers.json` schema here: https://www.pgadmin.org/docs/pgadmin4/latest/import_export_servers.html#json-format.
- One interesting fact about defining `servers.json` content inside `compose.yml` is that then we can utilize our `.env` file and reuse them. No need to hardcode anything.
- Here we are passing the password through docker secrets.

&mdash; [Ref](https://stackoverflow.com/a/77519799/8784518).

## The usual way

1. Add New Server
2. Give it a name (It can be anything)
3. Go to the second tab (Connection)
4. Enter your service name in the “Host name/address” text box -- In our case `postgres`.
   ```yml
   services:
     postgres:
   ```
   You need to use it also in your codebase to connect to it
5. Now enter your `POSTGRES_PASSWORD` as the “Maintenance database” and `POSTGRES_DB` as the “Password” and `POSTGRES_USER` as the “Username”

## `network_mode: host` is incompatible with port binding

- Just make sure your `80` (and `PGADMIN_EXPOSED_PORT` in case `compose.yml`) port is free. Because PgAdmin will run on that port.
- I cannot map any port to the PgAdmin while I am using host network. If you found a solution please share it with me with a PR.

  ```cmd
  ERROR: for xyz  "host" network_mode is incompatible with port_bindings
  ```

- If you use the `compose.yml` you cannot connect to the PostgreSQL instance due to what the docker do. Docker create a network for them and put them in that network. Therefore PgAdmin cannot connect to the database. I am not sure why. The prev paragraph was my guts words.
