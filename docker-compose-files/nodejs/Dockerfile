FROM node:22.14.0-bullseye

WORKDIR /app

COPY package*.json .
COPY index.mjs .

EXPOSE 3000

CMD ["npm", "start"]