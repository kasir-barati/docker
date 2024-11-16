# Docker volumes

How you ever wondered how docker volumes work? Let's jump into it real quick.

## Mechanics behind docker volumes

- A special type of storage in docker.
- Designed to **persist** data independent of the container lifecycle.
  - The idea is that when a container stops, crashes, or is deleted, the data stored in the volume remains intact **as long as the volume itself is not deleted**.
- Gives you data isolation.
- Bind mount:
  - Directly maps a host (your local system filesystem) directory, into a docker volume.
- Volume:
  - Is managed by docker and stored in docker's storage directory (e.g., `/var/lib/docker/volumes` on Linux).

## Compose files

- E.g. in [this compose file](../docker-compose-files/postgres/postgres-pgadmin/compose.yml) we Map a named volume (i.e. `postgres`) to the container path `/var/lib/postgresql/data/pgdata`.

  That is where PostgreSQL stores its data files by default ([ref](https://github.com/docker-library/docs/blob/master/postgres/README.md#pgdata)). This ensures PostgreSQL's database files are written to the volume.

- To test it:
  1. Run [this python script](../docker-compose-files/postgres/postgres-pgadmin/test-persistence.py).
  2. `docker compose down`. Do NOT pass `-v` flag since it will delete the volume along side the data.
  3. `docker compose up -d`.
  4. Check your database to see if everything is there.
