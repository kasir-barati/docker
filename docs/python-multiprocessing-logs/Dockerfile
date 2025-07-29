FROM python:3.12.9-bullseye AS base

WORKDIR /app

RUN apt-get update && apt-get install -y make && rm -rf /var/lib/apt/lists/*

COPY Makefile .

FROM base AS dev

CMD ["make", "start"]

FROM base AS prod

COPY . .


CMD ["make", "start"]
