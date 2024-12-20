# For local development environment we are gonna use -var-file=dev.tfvars but for production env we are pass them - if they are not optional** - using GH variables or something similar
# **If they are optional we let terraform to generate them for us and we just export them as output where ever we needed, so we can use them in our codebase

variable "fusionauth_host" {
  type        = string
  description = "Host of our FusionAuth deployment"
}

variable "fusionauth_issuer" {
  type        = string
  description = "The URL of the JWT tokens issuer"
}

variable "fusionauth_api_key" {
  type        = string
  sensitive   = true
  description = "Super API Key used to access the FusionAuth API"
}

variable "fusionauth_tenant_id" {
  type        = string
  default     = ""
  description = "FusionAuth tenant id for local dev env"
}

variable "fusionauth_application_id" {
  type        = string
  default     = ""
  description = "FusionAuth application id for local dev env"
}

variable "fusionauth_my_group_id" {
  type        = string
  default     = ""
  description = "FusionAuth my group id for local dev env"
}

variable "fusionauth_default_application_name" {
  type    = string
  default = "FusionAuth"
}

variable "oauth_configuration_client_secret" {
  type        = string
  sensitive   = true
  description = "The Client Secret used to authenticate with the OAuth Provider"
}

variable "deployment" {
  type        = string
  default     = "local"
  description = "A string to specify the deployment env; local, stage, etc"
}

variable "fusionauth_email_configuration_host" {
  type        = string
  default     = "http://localhost"
  description = "The Email Server Host used to send emails from FusionAuth"
}

variable "fusionauth_email_configuration_port" {
  type    = number
  default = 1026
}

variable "fusionauth_email_security" {
  type        = string
  default     = "NONE"
  description = "NONE, SSL, TLS"
  validation {
    condition     = length(regexall("^(NONE|SSL|TLS)$", var.fusionauth_email_security)) > 0
    error_message = "ERROR: Valid types are 'NONE', 'SSL', and 'TLS'!"
  }
}

variable "fusionauth_email_configuration_username" {
  type        = string
  default     = "you-say-email-conf-user"
  description = "The email username used to authenticate with the OAuth Provider"
}

variable "fusionauth_email_configuration_password" {
  type        = string
  sensitive   = true
  description = "The email password used to authenticate with the OAuth Provider"
}
