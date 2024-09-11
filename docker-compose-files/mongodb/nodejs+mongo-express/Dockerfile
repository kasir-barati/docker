ARG PORT

FROM node:20.10.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app
COPY pnpm-lock.yaml .
RUN pnpm fetch


FROM base AS build
COPY . .
RUN pnpm install -r --offline
# RUN pnpm run build


FROM base
ARG PORT
COPY --from=build /usr/src/app /usr/src/app
EXPOSE ${PORT}
CMD [ "pnpm", "start" ]
