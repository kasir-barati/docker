terraform {
  required_version = ">= 1.4.2, <= 1.5.7"

  required_providers {
    fusionauth = {
      source  = "FusionAuth/fusionauth"
      version = "0.1.101"
    }
    httpclient = {
      version = "0.0.3"
      source  = "dmachard/http-client"
    }
  }
}

provider "fusionauth" {
  host    = var.fusionauth_host
  api_key = var.fusionauth_api_key
}

resource "fusionauth_tenant" "my-tenant" {
  name      = "my-tenant"
  issuer    = var.fusionauth_issuer
  theme_id  = fusionauth_theme.custom-theme.id
  tenant_id = var.fusionauth_tenant_id == "" ? null : var.fusionauth_tenant_id

  login_configuration {
    require_authentication = true
  }
  multi_factor_configuration {
    login_policy = "Disabled"
  }
  email_configuration {
    set_password_email_template_id = fusionauth_email.setup-password-email-template.id
    host                           = var.fusionauth_email_configuration_host
    port                           = var.fusionauth_email_configuration_port
    security                       = var.fusionauth_email_security
    username                       = var.fusionauth_email_configuration_username
    password                       = var.fusionauth_email_configuration_password
  }
  jwt_configuration {
    access_token_key_id                   = fusionauth_key.access-token-key.id
    id_token_key_id                       = fusionauth_key.id-token-key.id
    refresh_token_time_to_live_in_minutes = 43200
    time_to_live_in_seconds               = 3600
  }
  external_identifier_configuration {
    authorization_grant_id_time_to_live_in_seconds = 30

    change_password_id_time_to_live_in_seconds = 600
    change_password_id_generator {
      length = 32
      type   = "randomBytes"
    }

    device_code_time_to_live_in_seconds = 1000
    device_user_code_id_generator {
      length = 6
      type   = "randomAlphaNumeric"
    }

    email_verification_id_time_to_live_in_seconds = 600
    email_verification_id_generator {
      length = 32
      type   = "randomBytes"
    }
    email_verification_one_time_code_generator {
      length = 6
      type   = "randomAlphaNumeric"
    }

    setup_password_id_time_to_live_in_seconds = 86400
    setup_password_id_generator {
      length = 32
      type   = "randomBytes"
    }

    passwordless_login_time_to_live_in_seconds = 600
    passwordless_login_generator {
      length = 32
      type   = "randomBytes"
    }

    two_factor_id_time_to_live_in_seconds       = 300
    two_factor_trust_id_time_to_live_in_seconds = 2592000
    two_factor_one_time_code_id_generator {
      length = 6
      type   = "randomDigits"
    }

    registration_verification_id_time_to_live_in_seconds = 86400
    registration_verification_id_generator {
      length = 32
      type   = "randomBytes"
    }
    registration_verification_one_time_code_generator {
      length = 6
      type   = "randomAlphaNumeric"
    }

    one_time_password_time_to_live_in_seconds          = 60
    external_authentication_id_time_to_live_in_seconds = 300
  }
}

resource "fusionauth_application" "my-application" {
  name           = "my-application"
  tenant_id      = fusionauth_tenant.my-tenant.id
  application_id = var.fusionauth_application_id == "" ? null : var.fusionauth_application_id

  oauth_configuration {
    client_secret           = var.oauth_configuration_client_secret
    enabled_grants          = ["authorization_code", "refresh_token", "password"]
    generate_refresh_tokens = true
    logout_url              = "http://localhost:3000/auth/login"
    authorized_redirect_urls = [
      "http://localhost:3000/auth/login",
      "http://localhost:3000/auth/oauth-callback",
    ]
    require_registration               = true
    proof_key_for_code_exchange_policy = "NotRequired"
    client_authentication_policy       = "NotRequired"
  }

  lambda_configuration {
    access_token_populate_id = fusionauth_lambda.access-token-populate-lambda-function.id
    id_token_populate_id     = fusionauth_lambda.id-token-populate-lambda-function.id
  }
}

resource "fusionauth_user" "my-tenant-admin-user" {
  tenant_id  = fusionauth_tenant.my-tenant.id
  email      = "my-tenant-admin@admin.com"
  username   = "my-tenant-admin@admin.com"
  first_name = "Admin"
  last_name  = "Admin"
  password   = "adminadmin"
  data = jsonencode({
    settings = { "theme" : "dark", "locale" : "en" }
  })
}

resource "fusionauth_registration" "my-tenant-admin-registration" {
  user_id        = fusionauth_user.my-tenant-admin-user.user_id
  application_id = fusionauth_application.my-application.id
}

resource "fusionauth_application_role" "my-role" {
  name           = "my-role"
  description    = "example role"
  application_id = fusionauth_application.my-application.id
  is_default     = false
  is_super_role  = false
}

resource "fusionauth_group" "my-group" {
  name      = "my-group"
  tenant_id = fusionauth_tenant.my-tenant.id
  group_id  = var.fusionauth_my_group_id == "" ? null : var.fusionauth_my_group_id
  role_ids = [
    fusionauth_application_role.my-role.id
  ]
}

resource "fusionauth_key" "access-token-key" {
  algorithm = "RS256"
  name      = "key-for-access-token-key"
  length    = 4096
}

resource "fusionauth_key" "id-token-key" {
  algorithm = "RS256"
  name      = "key-for-id-token-key"
  length    = 4096
}

resource "fusionauth_lambda" "access-token-populate-lambda-function" {
  name = "access-token-populate-lambda-function"
  type = "JWTPopulate"
  body = file("${path.module}/lambda-functions/access-token.js")
}

resource "fusionauth_lambda" "id-token-populate-lambda-function" {
  name = "id-token-populate-lambda-function"
  type = "JWTPopulate"
  body = file("${path.module}/lambda-functions/id-token.js")
}

resource "fusionauth_theme" "custom-theme" {
  name              = "Custom Theme"
  source_theme_id   = "75a068fd-e94b-451a-9aeb-3ddb9a3b5987"
  stylesheet        = file("${path.module}/stylesheet.css")
  helpers           = file("${path.module}/templates/helpers.ftl")
  index             = file("${path.module}/templates/index.ftl")
  oauth2_authorize  = file("${path.module}/templates/login.ftl")
  default_messages  = file("${path.module}/templates/messages.ftl")
  password_complete = file("${path.module}/templates/change-password-complete.ftl")
}

resource "fusionauth_email" "setup-password-email-template" {
  name                  = "Setup password email template"
  default_from_name     = "test@test.com"
  default_html_template = file("${path.module}/templates/email/set-password.html.ftl")
  default_subject       = "Setup password"
  default_text_template = file("${path.module}/templates/email/set-password.txt.ftl")
  from_email            = "email@email.com"
}

data "httpclient_request" "set-default-tenant-theme" {
  depends_on     = [fusionauth_theme.custom-theme, data.httpclient_request.get-default-tenant]
  url            = "${var.fusionauth_host}/api/tenant/${local.fusionauth_default_tenant_id}"
  request_method = "PATCH"
  request_headers = {
    "Accept"        = "application/json"
    "Content-Type"  = "application/json"
    "Authorization" = "${var.fusionauth_api_key}"
  }
  request_body = jsonencode(
    {
      "tenant" : {
        "name" : "${local.fusionauth_tenant_name}",
        "themeId" : "${fusionauth_theme.custom-theme.id}"
      }
    }
  )
}

data "httpclient_request" "create-super-admin-user" {
  depends_on     = [fusionauth_theme.custom-theme, data.httpclient_request.get-default-application]
  url            = "${var.fusionauth_host}/api/user/registration"
  request_method = "POST"
  request_headers = {
    "Accept"                = "application/json"
    "Content-Type"          = "application/json"
    "Authorization"         = "${var.fusionauth_api_key}"
    "X-FusionAuth-TenantId" = "${local.fusionauth_default_tenant_id}"
  }
  request_body = jsonencode(
    {
      "skipRegistrationVerification" : true,
      "skipVerification" : true,
      "registration" : {
        "applicationId" : "${local.fusionauth_default_application_id}",
        "roles" : ["admin"],
        "username" : "admin@admin.com"
      }
      "user" : {
        "email" : "admin@admin.com",
        "password" : "adminadmin",
        "firstName" : "Admin",
        "lastName" : "Admin"
      }
    }
  )
}

