output "cluster_name" {
  description = "Name of the created EKS cluster."
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS API server endpoint."
  value       = module.eks.cluster_endpoint
}

output "region" {
  description = "Region the cluster was created in."
  value       = var.aws_region
}

output "vpc_id" {
  description = "VPC created for this cluster."
  value       = module.vpc.vpc_id
}

output "configure_kubectl" {
  description = "Run this after apply to point kubectl at the new cluster."
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "console_viewer_username" {
  description = "IAM username for signing into the AWS Console to view this cluster's pods/logs."
  value       = aws_iam_user.console_viewer.name
}

output "console_viewer_initial_password" {
  description = "One-time password for console_viewer_username's first Console login (a change is forced immediately after). Sensitive: run `terraform output -raw console_viewer_initial_password` to read it, don't print it in scripts/CI logs."
  value       = aws_iam_user_login_profile.console_viewer.password
  sensitive   = true
}

output "console_viewer_login_url" {
  description = "Sign-in URL for the console_viewer_username IAM user."
  value       = "https://${data.aws_caller_identity.current.account_id}.signin.aws.amazon.com/console"
}
