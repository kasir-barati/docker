# docker

My tested `Dockerfile`s &amp; docker compose files which I use them and try to keep them up to date. Consider giving this repo a star if it was helpful to you so it can reaches more devs such as yourself.

## Docs

- [Glossary](./docs/glossary.md).
- [Redis](./docs/redis.md).
- [PostgreSQL](./docs/docs/postgresql.md).
- [Choosing the right image](./docs/docs/choose-the-right-image.md).
- [Docker volumes](./docs/volumes.md).

# Tips:

- Passing multiple env file to the docker-compose file -- [ref](https://github.com/docker/compose/issues/7326#issuecomment-1252426491)
  ```cmd
  docker-compose --env-file <(cat "./docker/.env" "./docker/.env.local") up -d
  ```

## Instruction for use

- You can find the tested `Dockerfile`s & `docker-compose.yml` files in the main branch
- You can find more `docker-compose.yml` files in the docker-compose branch
- You can see my latest `Dockerfile`s in the dockerfile branch

Feel free to open issues on this repo.
