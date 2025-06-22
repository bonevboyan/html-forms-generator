# 1. Build stage: install dependencies and compile TypeScript
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# 2. Production stage: run only the compiled JS
FROM node:18-slim

WORKDIR /app

# Install OpenSSL - required by Prisma
RUN apt-get update -y && apt-get install -y openssl

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Create a script to run migrations and start the app
RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnode dist/index.js' > ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3001

CMD ["./start.sh"]