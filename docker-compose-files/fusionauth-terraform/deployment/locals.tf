data "httpclient_request" "get-default-tenant" {
  url            = "${var.fusionauth_host}/api/tenant/search?name=Default"
  request_method = "GET"
  request_headers = {
    "Accept"        = "application/json"
    "Authorization" = "${var.fusionauth_api_key}"
  }
}

data "httpclient_request" "get-default-application" {
  url            = "${var.fusionauth_host}/api/application/search?name=${var.fusionauth_application_name}"
  request_method = "GET"
  request_headers = {
    "Accept"        = "application/json"
    "Authorization" = "${var.fusionauth_api_key}"
  }
}

locals {
  fusionauth_tenant_id      = jsondecode(data.httpclient_request.get-default-tenant.response_body).tenants[0].id
  fusionauth_tenant_name    = jsondecode(data.httpclient_request.get-default-tenant.response_body).tenants[0].name
  fusionauth_application_id = jsondecode(data.httpclient_request.get-default-application.response_body).applications[0].id
}
