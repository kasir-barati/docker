# A dedicated VPC for this cluster. EKS needs subnets in at least 2 AZs, and the subnets need specific tags so that:
#  - The AWS Load Balancer / in-tree controller knows which subnets to put NodePort/LoadBalancer-type Service ELBs into (kubernetes.io/role/elb),
#  - Karpenter/cluster-autoscaler-style discovery can find private subnets for internal load balancers (kubernetes.io/role/internal-elb).
# The module below sets those tags for us.

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.0"

  name = "${var.cluster_name}-vpc"
  cidr = var.vpc_cidr

  azs             = var.azs
  private_subnets = [for i, az in var.azs : cidrsubnet(var.vpc_cidr, 8, i)]
  public_subnets  = [for i, az in var.azs : cidrsubnet(var.vpc_cidr, 8, i + 100)]

  # Single NAT gateway keeps cost down for a demo/dev cluster.
  single_nat_gateway   = true
  enable_nat_gateway   = true
  enable_dns_hostnames = true
  # one_nat_gateway_per_az = true # Uncomment this if you need AZ-level HA on egress.

  public_subnet_tags = {
    "kubernetes.io/role/elb"                    = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"           = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
  }
}
