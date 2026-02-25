FROM node:24.13-alpine AS base
RUN apk add --no-cache curl
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

FROM base AS dev
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
CMD ["pnpm", "run", "start:dev"]

FROM base AS prod
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
