# syntax=docker/dockerfile:1

FROM node:24-alpine AS base

# ── deps: install dependency dengan lockfile ─────────────────────────────
FROM base AS deps
# libc6-compat: kompatibilitas binary native (swc/sharp) di Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
# pnpm via npm -g (corepack di Node 22 sering gagal verifikasi signature pnpm baru)
RUN npm install -g pnpm@11
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ── builder: generate prisma client + build next ─────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* dibake saat build — dikirim dari .env lewat docker compose build args
ARG NEXT_PUBLIC_SCHOOL_NPSN
ARG NEXT_PUBLIC_SCHOOL_CONTACT_ADDRESS
ARG NEXT_PUBLIC_SCHOOL_CONTACT_EMAIL
ARG NEXT_PUBLIC_SCHOOL_CONTACT_PHONE
ARG NEXT_PUBLIC_SCHOOL_CONTACT_MAP

RUN pnpm exec prisma generate && pnpm build

# ── runner: image runtime minimal dari output standalone ─────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
