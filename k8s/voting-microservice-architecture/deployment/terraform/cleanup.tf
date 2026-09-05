# Deleting Kubernetes-created LoadBalancer Services (voting-service.yaml/result-service.yaml, both `type: LoadBalancer`) is a required step BEFORE this cluster's VPC/subnets can be destroyed cleanly -- those NLBs were created by an in-cluster AWS controller reacting to `type: LoadBalancer`, not by any `resource` block here, so plain `terraform destroy` has no record of them and no way to remove them itself.
# This resource exists purely to run that cleanup automatically, at the right point in the destroy order, so you don't have to remember to do it by hand every time.
resource "null_resource" "delete_loadbalancer_services" {
  # Destroy-time provisioners can only read `self.triggers`, we capture everything the provisioner needs here, at create time.
  # Terraform forbids referencing other resources' live attributes during destroy, since those resources may already be gone.
  triggers = {
    cluster_name    = module.eks.cluster_name
    region          = var.aws_region
    voting_manifest = "${path.module}/../voting-service.yaml"
    result_manifest = "${path.module}/../result-service.yaml"
  }

  # Ensures this resource is created only once the cluster exists (so it has something to point kubectl at), and -- more importantly -- that on `destroy` it is torn down before module.eks, since Terraform destroys in reverse dependency order. That ordering is the entire point: the LBs must be gone before the node group/cluster/VPC teardown begins.
  depends_on = [module.eks]

  provisioner "local-exec" {
    when       = destroy
    on_failure = continue
    command    = <<-EOT
      set -e
      echo "[cleanup] pointing kubectl at ${self.triggers.cluster_name}..."
      aws eks update-kubeconfig \
        --region "${self.triggers.region}" \
        --name "${self.triggers.cluster_name}"

      echo "[cleanup] deleting LoadBalancer Services (frees the AWS NLBs)..."
      kubectl delete \
        -f "${self.triggers.voting_manifest}" \
        -f "${self.triggers.result_manifest}" \
        --ignore-not-found \
        --wait=true \
        --timeout=120s

      echo "[cleanup] done -- safe for terraform to destroy the VPC/subnets now."
    EOT
  }
}
