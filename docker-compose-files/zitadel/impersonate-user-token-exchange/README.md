# User Impersonation

> [!NOTE]
>
> You can learn more about the `compose.yml` file [here](./COMPOSE.md).

Here we:

- Run ZITADEL locally.
- Configure ZITADEL via a NodeJS init script using `fetch`, create:
  - A Project.
  - OIDC app.
  - 2 roles (admin, guest).
  - 2 human users (and grants them those roles).
  - A service account with a machine JSON key,
- Start a tiny NodeJS API with two endpoints:
  - `POST /books` → requires admin.
  - `GET /books/:id` → requires guest.
- Run end‑to‑end tests that:
  - Use the JWT Profile to obtain an actor token for the service account.
  - Perform Token Exchange (RFC 8693) to impersonate admin and guest and call the API accordingly.

The flow follows ZITADEL's documented capabilities:

- Client/Machine users authenticate non‑interactively (Client Credentials or JWT Profile) and Token Exchange can impersonate a human user;
- You can request a JWT access token by setting `requested_token_type=urn:ietf:params:oauth:token-type:jwt` in the exchange.
- Also, roles can be asserted in tokens by requesting the right reserved scopes and/or enabling the project/app token settings.

Notes, with references

- Token Exchange (impersonation) and the `actor_token/subject_token_type=user_id` parameters are part of ZITADEL's RFC 8693 implementation. When requesting an access token you can ask for **JWT** instead of the default opaque type via `requested_token_type`.
- JWT Profile (grant) is supported and ideal for service accounts; we generate a machine key and sign a short‑lived JWT assertion to the /oauth/v2/token endpoint.
- Roles in tokens: either enable assertion in project/app token settings or include role/audience reserved scopes like `urn:zitadel:iam:org:project:id:{projectId}:aud` and `urn:zitadel:iam:org:projects:roles`.
- We use Management API (v1) REST routes for:
  - Creating an OIDC app, creating project roles, user grants, etc. (/management/v1/...).
  - The v2 resource APIs exist too, but v1 remains valid and widely used from HTTP.
  - The example sticks to v1 for broad compatibility, and uses v2 for human user creation (as shown in community examples).

## Project Structure

```
├─ compose.yml
├─ .env               # minimal runtime env
├─ .env.example
├─ Makefile
├─ setup-zitadel/
│  ├─ package.json
│  └─ src/
│     ├─ main.js      # calls ZITADEL REST APIs via fetch
│     ├─ services/    # ZITADEL API service wrappers (v1 & v2)
│     └─ utils/       # helper utilities (logger, file operations, etc.)
├─ book-api/
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
│     ├─ main.js      # Express API + JWT verification via ZITADEL JWKS
│     ├─ middlewares/ # auth middleware
│     └─ utils/       # role checking utilities
└─ book-api-integration-tests/
   ├─ Dockerfile
   ├─ package.json
   └─ src/
      └─ main.spec.js # obtain actor token (JWT Profile) → token-exchange → call API
```

## How to Start

```bash
cp .env.example .env
docker compose up --build -d
```

## Testing Roles

We have a ZITADEL setup in out local fullstack application + roles which are also managed by ZITADEL. Some of the NestJS GraphQL APIs are protected by checking if user has a certain role. I have a frontend app written in ReactJS. So the flow is pretty much the [standard OIDC flow](https://ZITADEL.com/docs/guides/integrate/login/oidc/login-users).

As part of the setup process for ZITADEL I created a user and a couple of roles. Then I assigned the role I intended to the user. And I am able to use its username and password to login.

Now to write integration tests for our backend I am still running the ZITADEL, the problem is that I am sending the requests to the backend but ZITADEL is managing the whole token generation. So we have users and their roles assigned to them.

> [!IMPORTANT]
>
> [`UserInfo` API](https://zitadel.com/docs/guides/integrate/retrieve-user-roles#retrieve-roles-from-the-userinfo-endpoint) of ZITADEL do not return the roles of a user created using PATs.
>
> [ZITADEL dropped supporting the password grant type](https://ZITADEL.com/docs/apis/openidoauth/grant-types#resource-owner-password-credentials): "Due to growing security concerns we do not support this grant type. With OAuth 2.1 it looks like this grant will be removed.". Thus we **cannot** get an `access_token` using a simple request to the ZITADEL API:
>
> ```bash
> curl --request POST \
>      --url "http://localhost:9000/oauth/v2/token" \
>      --header 'Content-Type: application/x-www-form-urlencoded' \
>      --data 'grant_type=password' \
>      --data-urlencode 'username=alice@example.com' \
>      --data-urlencode 'password=s3cr3t' \
>      --data 'scope=openid profile email offline_access'
> ```
>
> NOTE: On ZITADEL this will fail with: `{"error":"unsupported_grant_type"}`.

So we have an admin user whom can impersonate another user in our integration test setup. ZITADEL allows any application to use [Token Exchange](https://zitadel.com/docs/guides/integrate/token-exchange), however they strongly recommend to only configure **confidential clients** (using either client credentials) with the Token Exchange grant type. This is because there is some trust placed in the application when it comes to defining scope and that it obtained tokens in a legitimate way.

> [!NOTE]
>
> This is actually what we also do for our integration tests.
>
> <details><summary>But if you'd like to read more about why we are creating a separate confidential app...</summary>
>
> 1. Security Principle of Least Privilege & blast-radius control: my normal `book-app` should NOT have the ability to exchange token. **THOUGH** keep in mind that if you enable your QA to test your app you might wanna create a separate app from your production/dev env and grant it token exchange privileges.
>    > ⚠️ **Critical Safeguards for Token Exchange Feature in Production & QA**:
>    >
>    > User impersonation should be **auditable, time-limited, and leave a trail**:
>    >
>    > - Every token-exchange action is logged.
>    > - You can track who exchange their token for what role/user and when.
>    > - Token exchanges expire after a defined period.
>    >
>    > **If you implement QA impersonation, you need similar safeguards!**
> 2. Token Exchange Requires Client Credentials & since it inherently requires a high degree of trust we can do it in our integration tests ([RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html)).
> 3. Separation of Concerns.
> 4. Can evaluate RBAC checks we have in our backend in the integration tests.
>
> </details>

For example, if the app possesses a token of an admin user with impersonation permissions it can obtain tokens for any other user in your instance. It is your responsibility to make sure the application can be trusted with this kind of powers. But since this is **only** limited to our integration tests it should be pretty fine.

> [!TIP]
>
> We are going to use `VITE_OIDC_SCOPE` in the book-api-integration-tests too, so we have the same scope in both environments.

Here is an example request one might send to ZITADEL:

```bash
curl -L -X POST 'http://localhost:9000/oauth/v2/token' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -H 'Accept: application/json' \
     -u '259254409320529922@portal:eNdXJzB5RK5CXSpa4HqEfbdDqlM7drpskEHq1RBYMby0tM1MaCidyWsWlp5mglbN' \
     -d 'grant_type=urn:ietf:params:oauth:grant-type:token-exchange' \
     -d 'subject_token=NaUAPHy5mLFQlwUCeUGYeDyhcQYuNhzTiYgwMor9BxP_bfMy2iDdLxJ87nntUc85vNyeHOY' \
     -d 'subject_token_type=urn:ietf:params:oauth:token-type:access_token' \
     -d 'scope=openid' \
     -d 'audience=259254020357488642' | jq
```
