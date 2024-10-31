# postgresql in docker-compose

## How to use these `docker-compose`?

1. Create a directory named `pgdata` next to the `compose.yml`.
2. `cp .env.example .env` (make necessary changes if needed any).
3. `cp .postgresql.env.example .postgresql.env` (make necessary changes if needed any).
4. `docker compose up`.

---

## More details about what I did in `compose.yml`

In the following sections you can see more info about the reasons behind what I did in this docker-compose file.

---

### What is `bind` in `volumes` section?

- Bind mounts have been around since the early days of Docker.
- Bind mounts have limited functionality compared to volumes.
- When you use a bind mount, a file or directory on the host machine is mounted into a container.
- Reference it by its **absolute** path on the host machine.
- By contrast, when you use a volume, a new directory is created within Docker’s storage directory on the host machine, and **Docker manages that directory’s contents**.

#### What is the `:z` at the end of target?

- While using SELinux to control processes within the container, contents that gets volume mounted into the container should be readable, and potentially writable.
- By default, Docker container processes run with the `system_u:system_r:svirt_lxc_net_t:s0` label. The `svirt_lxc_net_t` type is allowed to read/execute most content under /usr, but it is not allowed to use most other types on the system.
- In our example we need to guarantee the read and write access for the container in the `/var/lib/postgresql/data` that is mounted. So we add `:z` to execute this command automatically `chcon -Rt svirt_sandbox_file_t -l s0:c1,c2 /var/lib/postgresql/data`

[original ref in stackoverflow](https://stackoverflow.com/a/31334443/8784518)

---

### What is `COMPOSE_PROJECT_NAME`?

- Sets the project name. This value is **prepended** along with the service name to the container on start up.
- Setting this is optional. If you do not set this, the COMPOSE_PROJECT_NAME defaults to the basename of the project directory.

For example in our case project name is `postgresql` and it includes one services `postgres`, then Compose starts containers named `postgresql_postgres` respectively. But we can specify this env to change the **prepended** string. BTW in our case I specified the container name explicitly.

---

### What is `PGDATA` environmental variable?

- This **optional** variable can be used to define another location - like a subdirectory - for the database files.
- Default place: `/var/lib/postgresql/data`.
- If the data volume you're using is a filesystem mountpoint (like with GCE persistent disks) or remote folder that cannot be `chowned` to the postgres user (like some NFS mounts), Postgres `initdb` recommends a subdirectory be created to contain the data.

---

### Why `bridge` driver for network?

- `bridge` is the default one
- Bridge networks are usually used when your applications run in standalone containers that need to communicate.
- Sometimes I need to use `host`, **If I need to access it - container - directly from host**
