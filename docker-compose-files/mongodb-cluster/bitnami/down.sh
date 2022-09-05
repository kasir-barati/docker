docker-compose down --remove-orphans

docker-compose -f cluster/docker-compose.yaml down --remove-orphans

docker system prune -f