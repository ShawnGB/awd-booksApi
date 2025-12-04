# Build backend
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# Copy frontend static files (must be present in public/ directory before build)
COPY public ./public
EXPOSE 3000

CMD ["node", "dist/main"]
