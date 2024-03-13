output "my_tenant_id" {
  value = local.fusionauth_my_tenant_id
}

output "default_tenant_id" {
  value = local.fusionauth_default_tenant_id
}

#region Why? IDK
output "client_id" {
  value = fusionauth_application.my-application.id
}

output "application_id" {
  value = local.fusionauth_application_id
}
#endregion

output "my_group_id" {
  value = fusionauth_group.my-group.id
}
