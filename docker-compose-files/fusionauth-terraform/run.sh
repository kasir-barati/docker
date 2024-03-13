#!/bin/bash

clear;

docker compose down -v;
docker compose up -d;
sleep 20;

# Check if the .terraform directory exists
if [ ! -d "deployment/.terraform" ] || [[ "$*" == *"--init"* ]]; then
    echo "Initializing terrafrom"
    rm -rf deployment/terraform.tfstate* deployment/.terraform*
    terraform -chdir=deployment init;
else
    echo "Initialization were skipped!"
fi

terraform -chdir=deployment plan;
terraform -chdir=deployment apply -auto-approve;
terraform -chdir=deployment apply -auto-approve;
