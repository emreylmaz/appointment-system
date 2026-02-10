# Backend Dockerfile
FROM node:22-alpine AS builder

# Add OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json* ./
# install dependencies without running postinstall scripts yet
RUN npm ci --ignore-scripts

COPY . .
# Now generate client since schema is available
RUN npx prisma generate --schema=src/prisma/schema.prisma

RUN npm run build
RUN npm prune --production

# Runner
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl curl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/prisma ./src/prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start: migrate + run
CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && node dist/server.js"]
