# Compose File

## `init-zitadel-pat-vol`

- A simple initialization container that prepares the shared Docker volume for storing ZITADEL's Personal Access Tokens (PATs).
- **Purpose**: It runs a BusyBox container that sets permissions on the `/zitadel-pat` volume directory to `1777` (rwxrwxrwt - read/write/execute for all users, with sticky bit).

**Why it's needed**:

1. The `zitadel-init` service writes PAT tokens to this volume (for the bot machine user and login-client).
2. Other services like `setup-zitadel`, `book-api`, and `book-api-integration-tests` need to read these tokens.
3. Without proper permissions, there would be permission conflicts between containers running as different users.
4. The `1777` permission ensures all containers can read/write to the volume regardless of their user ID.

**In the flow**:

- `init-zitadel-pat-vol` runs first and sets up the volume permissions.
- `zitadel-init` writes the PAT tokens to `/zitadel-pat/token` and `/zitadel-pat/login-client.pat`.
- `setup-zitadel` reads these tokens to make authenticated API calls to configure ZITADEL (create projects, users, roles, etc.).
- `book-api` and `book-api-integration-tests` also mount this volume as read-only to access the tokens.

## `create-zitadel-database`

**Yes, they ARE necessary, and here's where they're created:**

Looking at the service, you can see this SQL command:

```sql
CREATE ROLE zitadel LOGIN PASSWORD 'zitadel';
```

This creates the PostgreSQL role (user) with:

- Username: `zitadel`
- Password: `zitadel`

Then the database is created with this user as the owner:

```sql
CREATE DATABASE ${ZITADEL_DATABASE} OWNER zitadel;
```

## `zitadel-init`

ZITADEL requires **two different database users** for security reasons:

1. **Admin User**:
   - Used by ZITADEL during initialization to create database schemas and tables.
   - Needs elevated privileges to perform DDL operations (CREATE TABLE, ALTER, etc.).
   - Called `ZITADEL_DATABASE_POSTGRES_ADMIN_*`.
   - Their values come from `POSTGRES_USER`/`POSTGRES_PASSWORD`.
2. **Runtime User**:
   - Used by ZITADEL during normal operation after initialization.
   - Only needs DML privileges (SELECT, INSERT, UPDATE, DELETE).
   - More restricted permissions following the principle of least privilege.
   - Called `ZITADEL_DATABASE_POSTGRES_USER_*`.
   - Their values are right now `zitadel`.
   - We are creating them in [`create-zitadel-setup`](#create-zitadel-database).

**The flow:**

1. `create-zitadel-database` service creates the `zitadel` role and database using admin credentials
2. `zitadel-init` uses admin credentials to set up the schema
3. `zitadel` (runtime) service uses the restricted `zitadel` user for day-to-day operations

> [!NOTE]
>
> This separation is a **security best practice** - the runtime application doesn't need schema-modification permissions. But it does also imply that you can use the root users too.
