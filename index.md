# docker

My Dockerfiles &amp; docker-compose files that tested

## Docs

- [PostgreSQL](./.github/docs/postgresql.md).
- [Choosing the right image](./.github/docs/choose-the-right-image.md).

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
