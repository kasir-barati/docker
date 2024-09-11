#!/bin/bash

SCRIPT=$(realpath -s "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

source ${SCRIPT_PATH}/.env

docker network create $NETWORK


docker-compose -f ${SCRIPT_PATH}/cluster/docker-compose.yaml up
