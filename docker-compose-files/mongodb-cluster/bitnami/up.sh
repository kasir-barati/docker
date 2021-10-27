source .env

docker network create $NETWORK

docker-compose -f cluster/docker-compose.yaml up -d

docker-compose up --force-recreate