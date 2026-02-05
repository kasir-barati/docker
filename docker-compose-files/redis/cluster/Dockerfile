FROM node:24.13-alpine AS base
# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./

FROM base AS build
RUN pnpm install
COPY . .
RUN pnpm build

FROM base AS development
CMD ["pnpm", "start:dev"]

FROM base AS production
RUN pnpm install --prod
COPY --from=build /app/dist ./dist
CMD ["pnpm", "start:prod"]
