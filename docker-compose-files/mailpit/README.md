# Mailpit with Node.js Email Sender

A Docker Compose setup featuring Mailpit for email testing and a Node.js TypeScript application that sends templated emails using Pug syntax.

## Features

- ✅ **Mailpit**: Email testing service with web UI
- ✅ **Node.js App**: TypeScript-based email sender
- ✅ **Multistage Dockerfile**: Optimized builds with base, build, dev, and prod stages
- ✅ **Email Templates**: Pug syntax with inline CSS
- ✅ **Environment Variables**: Direct injection (no dotenv)
- ✅ **JSDoc**: Type annotations without TypeScript types
- ✅ **Nodemailer + email-templates**: Robust email sending

## Project Structure

```
mailpit/
├── docker-compose.yml       # Docker services configuration
├── .env.example             # Example environment variables
├── README.md                # This file
└── app/
    ├── Dockerfile           # Multistage build (base, build, dev, prod)
    ├── package.json         # Dependencies and scripts
    ├── tsconfig.json        # TypeScript configuration
    ├── .dockerignore        # Docker ignore patterns
    └── src/
        └── main.ts          # Main application (email sender)
```

## Quick Start

### 1. Set Environment Variables

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` to configure your email settings:

```env
BUILD_TARGET=prod
SMTP_HOST=mailpit
SMTP_PORT=1025
EMAIL_FROM=sender@example.com
EMAIL_TO=recipient@example.com
USER_NAME=John Doe
MESSAGE=Welcome to our platform!
```

### 2. Run with Docker Compose

**Production Mode:**

```bash
docker compose up --build
```

**Development Mode:**

```bash
BUILD_TARGET=dev docker compose up --build
```

### 3. View Emails

Open your browser and navigate to:

```
http://localhost:8025
```

The app will send an email and exit. You can view the received email in the Mailpit web UI.

## How It Works

1. **Docker Compose** starts two services:
   - `mailpit`: Email testing server
   - `app`: Node.js application

2. **App Container**:
   - Reads environment variables
   - Creates an email template (Pug string with inline CSS)
   - Renders the template with provided variables
   - Sends email via Nodemailer to Mailpit
   - Exits after sending (container stops)

3. **Email Template**:
   - Written in Pug syntax as a string (simulates DB-fetched template)
   - Variables replaced dynamically (`userName`, `message`)
   - CSS styled inline in `<head>` tag
   - Automatically generates HTML

## Dockerfile Stages

### Base Stage

- Node 24.13 Alpine
- Includes curl
- Enables pnpm via corepack
- Sets working directory

### Build Stage

- Installs all dependencies with pnpm
- Compiles TypeScript to JavaScript

### Dev Stage

- Installs all dependencies with pnpm
- Runs with `start:dev` script (ts-node)
- Hot reload friendly

### Prod Stage

- Production dependencies only (pnpm)
- Uses compiled JavaScript from build stage
- Optimized for size and performance

## Environment Variables

| Variable       | Description                    | Default                    |
| -------------- | ------------------------------ | -------------------------- |
| `BUILD_TARGET` | Docker build target (dev/prod) | `prod`                     |
| `SMTP_HOST`    | SMTP server hostname           | `mailpit`                  |
| `SMTP_PORT`    | SMTP server port               | `1025`                     |
| `EMAIL_FROM`   | Sender email address           | `sender@example.com`       |
| `EMAIL_TO`     | Recipient email address        | `recipient@example.com`    |
| `USER_NAME`    | User name for template         | `John Doe`                 |
| `MESSAGE`      | Custom message for template    | `Welcome to our platform!` |

## Development

### Run in Development Mode

```bash
BUILD_TARGET=dev docker compose up --build
```

This uses the `start:dev` script which runs `ts-node` for hot reloading.

### Rebuild After Changes

```bash
docker compose up --build
```

### View Logs

```bash
docker compose logs -f app
```

## Notes

- The app exits after sending the email (expected behavior)
- No dotenv library used - pure environment variable injection
- Email template is a string (simulates real-world DB storage)
- JSDoc used instead of TypeScript type definitions
- All code organized in `src/` directory

## Ports

- **8025**: Mailpit Web UI
- **1025**: Mailpit SMTP Server

## Dependencies

- `nodemailer`: ^6.9.16
- `email-templates`: ^12.0.1
- `pug`: ^3.0.3
- `typescript`: ^5.7.3
- `ts-node`: ^10.9.2

## License

ISC
