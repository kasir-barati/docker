# Steps

1. `cp .env.example .env`
   **Note:** you cannot have hyphenated usernames since it produces errors
2. Keep in mind to synchronize your api key in `kickstart.json` file and `dev.tfvars`
3. `./run.sh --init`
4. Open localhost:9011 in your browser, now you can see that it is the default theme.
5. Do not close your browser, login with these credentials:
   - Email: admin@admin.com
   - Password: adminadmin

**Now make the request as it is described in this file: `./register.http` which fails**
**BUT when you execute the curl script it works just fine without the connection refused error**
