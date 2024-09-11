FROM node:20.10.0-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile

CMD [ "npm", "start" ]
