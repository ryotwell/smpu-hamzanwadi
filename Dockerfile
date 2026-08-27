# Base image dengan Node.js 24 (Alpine)
FROM node:24-alpine AS base

# Stage: instalasi dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Aktifkan corepack untuk pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy file dependency
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# Install dependencies (skip scripts untuk menghindari interaksi)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Stage: build aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Aktifkan corepack lagi di builder
RUN corepack enable && corepack prepare pnpm@latest --activate

# Rebuild semua binary package (esbuild, sharp, prisma, dll.) secara non-interaktif
RUN pnpm rebuild

# Generate Prisma client
RUN pnpm prisma generate

# Build Next.js (Turbopack di production tidak digunakan, tetap pakai next build)
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

# Copy hasil build
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