@AGENTS.md

## Tema Warna

Warna tema didefinisikan di `app/globals.css` via CSS variables — **jangan pernah pakai hardcoded hex atau `amber-*`**:

| Variable | Warna | Penggunaan |
|---|---|---|
| `--primary` | `oklch(0.8119 0.1696 77.4)` (gold) | CTA, badge, ikon aksen, hover state, tombol utama, teks aksen |
| `--secondary` | `oklch(0.3306 0.0787 157.04)` (teal gelap) | Background gelap (navbar scroll, stats, fasilitas, CTA section, footer) |

Gunakan Tailwind classes `bg-primary`, `text-primary`, `hover:text-primary`, `bg-secondary`, `text-secondary`, `text-primary-foreground`, `text-secondary-foreground`. Jangan gunakan `text-amber-*`, `bg-amber-*`, `#0a2a1a`, `#061a0f`, `#d4a017`, dll.
