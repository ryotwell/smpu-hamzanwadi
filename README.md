# SMP Unggulan Hamzanwadi — Web App

Website resmi SMP Unggulan Hamzanwadi Lombok Timur, NTB. Dibangun dengan [Next.js](https://nextjs.org).

## Tech Stack

- **Framework:** Next.js 16 + React 19
- **Database:** PostgreSQL + Prisma
- **Styling:** TailwindCSS 4 + Shadcn UI
- **Validation:** Zod + React Hook Form
- **File Upload:** AWS S3 via `@aws-sdk/client-s3`
- **Runtime:** Bun
- **Container:** Docker

## Quick Start with Docker

### Prerequisites
- Docker & Docker Compose
- PostgreSQL database (hosted separately)

### 1. Configure Environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
# Edit .env with your database URL, S3 credentials, etc.
```

### 2. Build & Run
```bash
docker compose up -d --build
```

The app will be available at `http://localhost:3000`

### 3. Run Migrations (first time only)
```bash
docker compose exec app bunx prisma migrate deploy
```

### Useful Commands
```bash
# View logs
docker compose logs -f app

# Stop
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Run Prisma commands
docker compose exec app bunx prisma studio
docker compose exec app bunx prisma migrate dev
```

## Tema Warna

Warna tema didefinisikan di `app/globals.css` sebagai CSS variables untuk light (`:root`) dan dark (`.dark`) mode.

| Variable | Warna | Nilai | Penggunaan |
|---|---|---|---|
| `--primary` | **Gold** | `oklch(0.8119 0.1696 77.4)` | Tombol CTA, badge, ikon aksen, hover state, teks aksen keemasan |
| `--secondary` | **Teal Gelap** | `oklch(0.3306 0.0787 157.04)` | Background gelap (navbar scroll, stats, fasilitas, CTA section, footer) |
| `--primary-foreground` | Hitam pekat | `oklch(0.147 0 0)` | Teks di atas background gold |
| `--secondary-foreground` | Putih | `oklch(0.985 0 0)` | Teks di atas background teal |

### Aturan Pewarnaan

1. **Gunakan CSS variables, bukan hardcoded hex.** Contoh:
   - ✅ `bg-primary` / `text-primary` / `hover:text-primary`
   - ✅ `bg-secondary` / `text-secondary-foreground`
   - ❌ `bg-amber-500` / `text-amber-600` / `hover:text-amber-400`
   - ❌ `bg-[#0a2a1a]` / `text-[#d4a017]` / `bg-[#061a0f]`

2. **Primary untuk aksen emas/gold** — tombol utama, label badge, ikon, hover links, dekorasi.

3. **Secondary untuk background gelap** — section yang butuh latar dark teal (navbar sticky, stats bar, fasilitas, CTA banner, footer).

4. **Opacity variants** bebas dipakai: `bg-primary/90`, `bg-secondary/80`, `border-primary/30`, `hover:bg-primary/20`, dll.

5. **Jangan gunakan `amber-*`** — semua warna gold/amber harus melalui `primary` agar konsisten.

6. **Warna netral** (`muted`, `muted-foreground`, `border`, `accent`) tetap aman dipakai untuk elemen non-aksen seperti teks deskripsi, card border, skeleton loading.

## Perintah `rtk`

Semua shell command harus diawali `rtk` untuk menghemat token:

```bash
rtk git status
rtk npm run dev
rtk ls src/
```

## Halaman

- **Main/Public** → `app/(main)/...`
- **Admin** → `app/admin/...`
- Semua halaman **dynamic** kecuali `/` (static root)

## Server Components

Gunakan Server Components secara default. Client component hanya ketika diperlukan (interaktivitas, hooks, event handlers).
