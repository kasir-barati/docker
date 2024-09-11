output "my_tenant_id" {
  value = local.fusionauth_my_tenant_id
}

output "default_tenant_id" {
  value = local.fusionauth_default_tenant_id
}

output "client_id" {
  value = fusionauth_application.my-application.id
}

output "my_application_id" {
  value = fusionauth_application.my-application.id
}

output "default_application_id" {
  value = local.fusionauth_default_application_id
}

output "my_group_id" {
  value = fusionauth_group.my-group.id
}
