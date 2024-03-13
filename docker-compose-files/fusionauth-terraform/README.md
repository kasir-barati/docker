# Steps

1. `cp .env.example .env`
   **Note:** you cannot have hyphenated usernames since it produces errors
2. `./run.sh --init`
3. Open localhost:9011 in your browser, now you can see that it is the default theme.
4. Do not close your browser, login with these credentials:
   - Email: admin@admin.com
   - Password: adminadmin
5. Go to the **FusionAuth** application and **Default** tenant, in the theme section you can see that CustomTheme is selected as the theme for that tenant.

`rm -rf deployment/terraform.tfstate* deployment/.terraform*`
