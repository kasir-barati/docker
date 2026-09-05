variable "aws_region" {
  description = "AWS region to deploy into. Learn more at https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Free-form tag applied to every resource (e.g. dev, staging)."
  type        = string
  default     = "dev"
}

variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
  default     = "voting-app-cluster"
}

variable "kubernetes_version" {
  description = "EKS control plane version. Find more at https://docs.aws.amazon.com/eks/latest/userguide/platform-versions.html"
  type        = string
  default     = "1.35"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC created for this cluster. Learn more at https://aws.amazon.com/what-is/cidr/#amsc4--2xgq98"
  type        = string
  default     = "10.0.0.0/16"
}

variable "azs" {
  description = "Availability zones to spread subnets across. Needs at least 2 for EKS."
  type        = list(string)
  default     = ["eu-central-1a", "eu-central-1b"]
}

variable "node_instance_types" {
  # FIXME: replace the dummy URL with the actual post
  description = "EC2 instance types for the EKS managed node group. Discussed at length at https://dev.to/my-post"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_desired_size" {
  description = "Desired number of worker nodes."
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum number of worker nodes."
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of worker nodes."
  type        = number
  default     = 3
}

variable "cluster_endpoint_public_access" {
  description = "Whether the EKS API server endpoint is reachable from the public internet. false is more secure but requires running kubectl/Terraform from inside the VPC (VPN/bastion/Cloud9)."
  type        = bool
  default     = true
}

variable "console_viewer_username" {
  description = "IAM username for the human, Console-only, read-access identity created in iam.tf. Separate from the terraform-voting-app automation identity."
  type        = string
  default     = "voting-app-console-viewer"
}
