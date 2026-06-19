# syntax=docker/dockerfile:1.7

# Pinned Bun version for both stages. FROM can't read package.json, so this is the
# one place the base-image tag lives — keep it in sync with package.json
# "packageManager". CI/CD can override with --build-arg BUN_VERSION=...
ARG BUN_VERSION=1.3.14

# Build stage
FROM oven/bun:${BUN_VERSION} AS builder

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

# Production stage. Alpine (musl) is the smallest sensible base. sharp's prebuilt
# musl binary ships in the standalone trace and is verified to load (libvips
# 8.17.3), so /_next/image optimisation still works. The builder stays on the full
# glibc image — its trace includes both glibc and musl sharp variants, so building
# on glibc and running on musl is fine.
FROM oven/bun:${BUN_VERSION}-alpine

WORKDIR /app

# curl backs the container/task health check (see HEALTHCHECK below and the
# healthCheck block in task-definition-*.json)
RUN apk add --no-cache curl

ENV NODE_ENV=production
# Bind all interfaces so the ALB/host can reach the container
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Standalone build: a self-contained server.js plus a traced, minimal
# node_modules. Static assets and public/ are not bundled, so copy them
# alongside the server where Next expects to serve them from.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port (Next.js default)
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD curl -f http://localhost:3000/healthcheck || exit 1

# Start the standalone server
CMD ["bun", "server.js"]
