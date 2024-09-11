FROM docker.io/node:20.10.0-alpine

RUN mkdir -p /app && chown -R 1000:1000 /app

WORKDIR /app

USER 1000:1000

EXPOSE 3000

CMD ["npm", "run", "dev"]
