#!/bin/bash

# Start Docker daemon in background with vfs storage driver (compatible with DinD)
dockerd \
    --host=unix:///var/run/docker.sock \
    --host=tcp://0.0.0.0:2376 \
    --storage-driver=vfs \
    --insecure-registry=localhost:5000 \
    --debug &

# Wait for Docker daemon to be ready
while ! docker info >/dev/null 2>&1; do
    echo "Waiting for Docker daemon to start..."
    sleep 2
done

# Execute the main command
exec "$@"
