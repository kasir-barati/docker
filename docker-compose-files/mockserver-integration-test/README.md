# The motivation behind this mini app

I was trying to mock Stripe and realized that it is a bit tricky to do so. As such I had written a post about it here and also shared the code here. You can find [the post here on dev.to](https://dev.to/kasir-barati/test-stripe-with-mockserver-57mo).

# How to run it

1. `npm ci` or `pnpm install --frozen-lockfile`.
2. `cp .env.example .env`.
3. `docker compose up -d`.
4. `npm test` or `pnpm test`.
