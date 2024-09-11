#!/bin/bash

SCRIPT=$(realpath -s "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

docker-compose -f ${SCRIPT_PATH}/cluster/docker-compose.yaml down --remove-orphans

docker system prune -f