variable "fusionauth_host" {
  type        = string
  default     = "http://localhost:9011"
  description = "Host of our FusionAuth deployment"
}

variable "fusionauth_api_key" {
  type        = string
  default     = "7ef6fa566cf6bd2948f86dc9174b1ad87a40a67fa00c72edab82d566b79eeb206d532b9f217eac391423d087c0a329bb5518d6281d2bb29c2919642b4cc7300f"
  description = "Super API Key used to access the FusionAuth API"
}

variable "fusionauth_application_name" {
  type    = string
  default = "FusionAuth"
}

variable "migrate_user" {
  type    = string
  default = "up_user_data_settings"
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

variable "client_secret" {
  default = "ee5e6b455bfe90afd80709da39a3b0d32f956018"
}
