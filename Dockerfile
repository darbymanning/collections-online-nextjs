# syntax=docker/dockerfile:1.7

# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Build-time argument for museum selection
ARG NEXT_PUBLIC_MUSEUM

# Copy package files
COPY bun.lock ./
COPY package.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js app with the NEXT_PUBLIC_MUSEUM variable
RUN NEXT_PUBLIC_MUSEUM=${NEXT_PUBLIC_MUSEUM} bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Install curl for healthchecks (optional)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose port (Next.js default)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", "start"]
