# A dedicated VPC for this cluster. EKS needs subnets in at least 2 AZs, and the subnets need specific tags so that:
#  - The AWS Load Balancer / in-tree controller knows which subnets to put NodePort/LoadBalancer-type Service ELBs into (kubernetes.io/role/elb),
#  - Karpenter/cluster-autoscaler-style discovery can find private subnets for internal load balancers (kubernetes.io/role/internal-elb).
# The module below sets those tags for us.

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.0"

  name = "${var.cluster_name}-vpc"
  # Default value: 10.0.0.0/16
  # The /16 reserves every address from 10.0.0.0 to 10.0.255.255, which amounts to 65,536
  cidr = var.vpc_cidr

  azs             = var.azs
  # Hands the whole /16 to cidrsubnet(var.vpc_cidr, 8, i) and cuts it into smaller /24 slices (256 addresses each) so each AZ gets its own private and public subnet instead of every EC2 node and load balancer in the account fighting over the same pool of addresses.
  private_subnets = [for i, az in var.azs : cidrsubnet(var.vpc_cidr, 8, i)]       # → 10.0.0.0/24
  public_subnets  = [for i, az in var.azs : cidrsubnet(var.vpc_cidr, 8, i + 100)] # → 10.0.100.0/24

  # Single NAT gateway keeps cost down for a demo/dev cluster (in the real world tho you would want a separate NAT gateway per AZ).
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
