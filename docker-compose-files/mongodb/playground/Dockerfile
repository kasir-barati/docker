FROM node:24.13-alpine AS base
WORKDIR app
COPY package*.json ./
RUN npm install

FROM base AS production
COPY . .
CMD ["npm", "run", "start"]
