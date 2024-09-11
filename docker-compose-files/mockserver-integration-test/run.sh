#! /bin/bash

docker compose down -v
docker system prune -f

chmod o+r $(pwd)/mockserver.properties

docker compose up -d

pnpm test
