FROM node:24.14-alpine
WORKDIR /integration-tests
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY . .
ENV NODE_ENV=production
CMD ["npm", "test"]
