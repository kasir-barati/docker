FROM docker.io/node:20.10.0-alpine

WORKDIR /app

RUN addgroup --system api && \
    adduser --system -G api api

COPY package*.json ./
RUN npm ci
COPY index.ts tsconfig.json healthcheck.js ./
RUN npm run build

RUN chown -R api:api .

EXPOSE 3000

CMD ["npm", "start"]
