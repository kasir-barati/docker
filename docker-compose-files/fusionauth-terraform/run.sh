#!/bin/bash

docker compose down -v;
docker compose up -d;
sleep 7;

# Check if the .terraform directory exists
if [ ! -d ".terraform" ]; then
    # Initialize the Terraform project
    terraform init -chdir=deployment;

terraform plan -chdir=deployment;
terraform apply -chdir=deployment -auto-approve;
