terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    # Null provider is a Terraform provider that doesn't manage any real infrastructure
    # No cloud API calls, nothing gets created in AWS, GCP, etc.
    # It's a utility provider used for orchestration tricks within Terraform itself.
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }

  # Terraform state is written to `terraform.tfstate` in this directory. That file is the source of truth for everything Terraform thinks it owns. Delete the terraform state file from your local machine while testing.
}
