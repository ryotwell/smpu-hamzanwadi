# Base image dengan Node.js 24 (Alpine)
FROM node:24-alpine AS base

# Stage: instalasi dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Aktifkan corepack untuk pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy file dependency
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
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

# Rebuild semua binary package (esbuild, sharp, prisma, dll.)
RUN pnpm rebuild

# Generate Prisma client
RUN pnpm prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

# Hanya variabel NEXT_PUBLIC_* yang perlu di-embed saat build
ARG NEXT_PUBLIC_SCHOOL_NPSN
ARG NEXT_PUBLIC_SCHOOL_CONTACT_ADDRESS
ARG NEXT_PUBLIC_SCHOOL_CONTACT_EMAIL
ARG NEXT_PUBLIC_SCHOOL_CONTACT_PHONE
ARG NEXT_PUBLIC_SCHOOL_CONTACT_MAP
ENV NEXT_PUBLIC_SCHOOL_NPSN=$NEXT_PUBLIC_SCHOOL_NPSN
ENV NEXT_PUBLIC_SCHOOL_CONTACT_ADDRESS=$NEXT_PUBLIC_SCHOOL_CONTACT_ADDRESS
ENV NEXT_PUBLIC_SCHOOL_CONTACT_EMAIL=$NEXT_PUBLIC_SCHOOL_CONTACT_EMAIL
ENV NEXT_PUBLIC_SCHOOL_CONTACT_PHONE=$NEXT_PUBLIC_SCHOOL_CONTACT_PHONE
ENV NEXT_PUBLIC_SCHOOL_CONTACT_MAP=$NEXT_PUBLIC_SCHOOL_CONTACT_MAP

# Build Next.js (Turbopack di production tidak digunakan, tetap pakai next build)
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