# Steps

1. ```cmd
   cd deployment
   terraform init
   terraform plan
   terraform apply
   ```
2. Open localhost:9012 in your browser, now you can see that it is the default theme.
3. Do not close your browser, login with these credentials:
   - Email: admin@admin.com
   - Password: adminadmin
4. Go to the **FusionAuth** application and **Default** tenant, in the theme section you can see that CustomTheme is selected as the theme for that tenant.

`rm -rf deployment/terraform.tfstate* deployment/.terraform*`
