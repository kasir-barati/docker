# Creates the EKS control plane, the IAM roles it needs, the node IAM role, and one managed node group of EC2 instances that actually run your pods.
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = var.cluster_name
  kubernetes_version = var.kubernetes_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  endpoint_public_access = var.cluster_endpoint_public_access

  # Grants the IAM identity running `terraform apply` cluster-admin via an EKS access entry, so `kubectl` can work with te cluster after apply without any extra aws-auth ConfigMap wrangling.
  enable_cluster_creator_admin_permissions = true

  # Read-only Kubernetes RBAC grant for the human Console-access user (iam.tf), so they can browse pods and other resources in the AWS Console without also getting cluster-admin.
  # Separate from the IAM policies in iam.tf.
  access_entries = {
    console_viewer = {
      principal_arn = aws_iam_user.console_viewer.arn
      policy_associations = {
        view = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSViewPolicy"
          access_scope = {
            type = "cluster"
          }
        }
      }
    }
  }

  addons = {
    coredns                = {}
    kube-proxy             = {}
    vpc-cni                = { before_compute = true }
    eks-pod-identity-agent = { before_compute = true }
  }

  eks_managed_node_groups = {
    default = {
      # Amazon Machine Image used for the EC2 instances in this managed node group
      ami_type       = "AL2023_x86_64_STANDARD"
      instance_types = var.node_instance_types

      min_size     = var.node_min_size
      max_size     = var.node_max_size
      desired_size = var.node_desired_size
    }
  }
}
