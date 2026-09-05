# A human-facing IAM user for browsing this cluster in the AWS Console. Deliberately separate from the `terraform-voting-app` identity whom runs `terraform apply` as (that one is programmatic-access-only and has to exist *before* apply, so Terraform can never create/own it). This user has no such bootstrap problem, so its whole lifecycle -- including Console access and its Kubernetes RBAC grant on this cluster -- can live here and get torn down by `terraform destroy` along with everything else.

resource "aws_iam_user" "console_viewer" {
  name = var.console_viewer_username
}

# Grants only what's needed to open this cluster's resources in the Console: reach the EKS API and describe this cluster. Kubernetes-level permissions (what they can actually see once there) come from the access entry in eks.tf, not from this IAM policy.
# Two statements, not one, because EKS's account/region-level actions (ListClusters, DescribeClusterVersions -- what the Console's cluster list page calls before you've even picked a cluster) don't support resource-level permissions at all; IAM only accepts Resource = "*" for them. Scoping them to this cluster's ARN, like the per-cluster actions below, denies them.
resource "aws_iam_user_policy" "console_viewer_eks_describe" {
  name = "eks-describe-${var.cluster_name}"
  user = aws_iam_user.console_viewer.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AccountLevelListActions"
        Effect = "Allow"
        Action = [
          "eks:ListClusters",
          "eks:DescribeClusterVersions",
        ]
        Resource = "*"
      },
      {
        Sid    = "ThisClusterOnly"
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:AccessKubernetesApi",
        ]
        Resource = module.eks.cluster_arn
      }
    ]
  })
}

# Generates a one-time initial password and forces a change on first AWS Console login.
resource "aws_iam_user_login_profile" "console_viewer" {
  user                    = aws_iam_user.console_viewer.name
  password_reset_required = true
}

# Enables IAM users to change their own password.
resource "aws_iam_user_policy_attachment" "console_viewer_change_password" {
  user       = aws_iam_user.console_viewer.name
  policy_arn = "arn:aws:iam::aws:policy/IAMUserChangePassword"
}
