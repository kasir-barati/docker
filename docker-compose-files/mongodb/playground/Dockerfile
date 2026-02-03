FROM node:24.13-alpine AS base
WORKDIR app
COPY package*.json ./
RUN npm install

from base AS development
CMD ["npm", "run", "start:dev"]

FROM base AS production
COPY . .
CMD ["npm", "run", "start"]
