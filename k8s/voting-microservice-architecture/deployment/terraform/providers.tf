provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "voting-microservice-architecture"
      ManagedBy   = "terraform"
      Environment = var.environment
    }
  }
}
