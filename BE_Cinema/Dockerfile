FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src/ ./src/
ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db
RUN npx prisma generate
RUN npm run build
RUN mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY prisma/ ./prisma/
COPY prisma.config.ts ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
