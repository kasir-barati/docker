#!/bin/bash

clear;

docker compose down -v;
docker compose up -d --build;
sleep 20;

# Check if the .terraform directory exists
if [ ! -d "deployment/.terraform" ] || [[ "$*" == *"--init"* ]]; then
    echo "Initializing terrafrom"
    rm -rf deployment/terraform.tfstate* deployment/.terraform*
    terraform -chdir=deployment init -var-file=dev.tfvars;
else
    echo "Initialization were skipped!"
fi

terraform -chdir=deployment plan -var-file=dev.tfvars;
terraform -chdir=deployment apply -var-file=dev.tfvars -auto-approve;
terraform -chdir=deployment apply -var-file=dev.tfvars -auto-approve;
