# Steps

1. First option:

   a. `terraform -chdir=deployment init`

   b. `terraform -chdir=deployment plan`

   c. `terraform -chdir=deployment apply -auto-approve`

2. Second option:

   a. `cd deployment`

   b. `terraform init`

   c. `terraform plan`

   d. `terraform apply`

`rm -rf deployment/terraform.tfstate* deployment/.terraform*`
