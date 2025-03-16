variable "fusionauth_api_key" {
  type        = string
  description = "API key for fusion auth."
}
variable "fusionauth_client_secret" {
  type        = string
  description = "Predefined secret used for fusion auth application."
}
variable "theme_id" {
  default     = "78005834-2688-4b73-b623-7d6bb3ccf126"
  description = "ID of the theme used for this tenant"
}
variable "set_password_email_template_id" {
  default     = "df716576-b571-4aa1-ae9a-f2412d5aa91d"
  description = "ID of the email template to set a password"
}
variable "email_host" {}
variable "email_port" {}
variable "email_username" {}
variable "email_password" {}
