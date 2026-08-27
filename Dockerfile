# Base image
FROM node:24-alpine AS base

# Stage: install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable corepack untuk pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install dependencies (frozen lockfile)
RUN pnpm install --frozen-lockfile

# Stage: build aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable pnpm lagi di stage builder (atau copy dari sebelumnya)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Generate Prisma client
RUN pnpm prisma generate

# Build Next.js (pastikan di package.json ada script "build": "next build")
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Stage: production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Buat user non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy hasil build dan file penting
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Set user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]