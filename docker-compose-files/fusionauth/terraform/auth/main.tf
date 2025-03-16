provider "fusionauth" {
  host    = var.host
  api_key = var.api_key
}

resource "fusionauth_key" "tenant1_access_token_key" {
  name      = "id_token_for_access_keys"
  length    = 2048
  algorithm = "RS256"
}

resource "fusionauth_key" "tenant1_id_token_key" {
  algorithm = "RS256"
  name      = "id_token_for_id_keys"
  length    = 2048
}

resource "fusionauth_tenant" "tenant1" {
  # The unique name of the Tenant.
  name = "Tenant 1"
  # The named issuer used to sign tokens, this is generally your public fully qualified domain.
  issuer = "https://fujitsu.com"
  # The unique Id of the theme to be used to style the login page and other end user templates.
  theme_id = var.theme_id

  multi_factor_configuration {
    # When the setting is Enabled and a user has set up two-factor authentication methods, they must complete a two-factor challenge when logging in. If set to Disabled, users won't need to complete a two-factor challenge during login, even if they've configured such methods. When the login policy is Required, a two-factor challenge is compulsory during login. Users without configured two-factor methods cannot log in.
    login_policy = "Disabled"
  }

  email_configuration {
    # The Id of the Email Template that is used when a user had their account created for them and they must set their password manually and they are sent an email to set their password.
    set_password_email_template_id = var.set_password_email_template_id
    # The host name of the SMTP server that FusionAuth will use.
    host = var.email_host
    # The port of the SMTP server that FusionAuth will use.
    port = var.email_port
    # An optional username FusionAuth will to authenticate with the SMTP server.
    username = var.email_username
    # An optional password FusionAuth will use to authenticate with the SMTP server.
    password = var.email_password
    # The type of security protocol FusionAuth will use when connecting to the SMTP server.
    security = "TLS"
    # The default From Name used in sending emails when a from name is not provided on an individual email template. This is the display name part of the email address ( i.e. Jared Dunn jared@piedpiper.com).
    default_from_name = var.email_username
    # The default email address that emails will be sent from when a from address is not provided on an individual email template. This is the address part email address (i.e. Jared Dunn jared@piedpiper.com).
    default_from_email = var.email_username
  }

  jwt_configuration {
    # The unique id of the signing key used to sign the access token
    access_token_key_id = fusionauth_key.tenant1_access_token_key.id
    # The unique id of the signing key used to sign the Id token.
    id_token_key_id = fusionauth_key.tenant1_id_token_key.id
    # The length of time in minutes a Refresh Token is valid from the time it was issued.
    refresh_token_time_to_live_in_minutes = 43200
    # The length of time in seconds this JWT is valid from the time it was issued.
    time_to_live_in_seconds = 3600
  }

  external_identifier_configuration {
    # The time in seconds until a OAuth authorization code is no longer valid to be exchanged for an access token. This is essentially the time allowed between the start of an Authorization request during the Authorization code grant and when you request an access token using this authorization code on the Token endpoint.
    authorization_grant_id_time_to_live_in_seconds = 30
    change_password_id_generator {
      # The length of the secure generator used for generating the change password Id.
      length = 32
      # The type of the secure generator used for generating the change password Id.
      type = "randomBytes"
    }
    # The time in seconds until a change password Id is no longer valid and cannot be used by the Change Password API.
    change_password_id_time_to_live_in_seconds = 600
    # The time in seconds until a device code Id is no longer valid and cannot be used by the Token API.
    device_code_time_to_live_in_seconds = 1000
    device_user_code_id_generator {
      # The length of the secure generator used for generating the change password Id.
      length = 6
      # The type of the secure generator used for generating the change password Id.
      type = "randomAlphaNumeric"
    }
    email_verification_id_generator {
      # The length of the secure generator used for generating the change password Id.
      length = 32
      # The type of the secure generator used for generating the change password Id.
      type = "randomBytes"
    }
    # The time in seconds until a email verification Id is no longer valid and cannot be used by the Verify Email API.
    email_verification_id_time_to_live_in_seconds = 600
    email_verification_one_time_code_generator {
      # The length of the secure generator used for generating the email verification one time code.
      length = 6
      # The type of the secure generator used for generating the email verification one time code.
      type = "randomAlphaNumeric"
    }
    setup_password_id_generator {
      # The length of the secure generator used for generating the change password Id.
      length = 32
      # The type of the secure generator used for generating the change password Id.
      type = "randomBytes"
    }
    # The time in seconds until a setup password Id is no longer valid and cannot be used by the Change Password API.
    setup_password_id_time_to_live_in_seconds = 86400
    passwordless_login_generator {
      # The length of the secure generator used for generating the change password Id.
      length = 32
      # The type of the secure generator used for generating the change password Id.
      type = "randomBytes"
    }
    # The time in seconds until a passwordless code is no longer valid and cannot be used by the Passwordless API.
    passwordless_login_time_to_live_in_seconds = 600
    # The time in seconds until a two factor Id is no longer valid and cannot be used by the Two Factor Login API
    two_factor_id_time_to_live_in_seconds = 300
    two_factor_one_time_code_id_generator {
      # The length of the secure generator used for generating the the two factor code Id.
      length = 6
      # The type of the secure generator used for generating the two factor one time code Id.
      type = "randomDigits"
    }
    # The time in seconds until an issued Two Factor trust Id is no longer valid and the User will be required to complete Two Factor authentication during the next authentication attempt.
    two_factor_trust_id_time_to_live_in_seconds = 2592000
    registration_verification_id_generator {
      # The length of the secure generator used for generating the change password Id.
      length = 32
      # The type of the secure generator used for generating the change password Id.
      type = "randomBytes"
    }
    # The time in seconds until a registration verification Id is no longer valid and cannot be used by the Verify Registration API.
    registration_verification_id_time_to_live_in_seconds = 86400
    registration_verification_one_time_code_generator {
      # The length of the secure generator used for generating the registration verification one time code.
      length = 6
      # The type of the secure generator used for generating the registration verification one time code.
      type = "randomAlphaNumeric"
    }
    # The time in seconds until an external authentication Id is no longer valid and cannot be used by the Token API.
    external_authentication_id_time_to_live_in_seconds = 300
    # The time in seconds until a One Time Password is no longer valid and cannot be used by the Login API.
    one_time_password_time_to_live_in_seconds = 60
  }
}
