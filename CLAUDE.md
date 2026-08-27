@AGENTS.md

## Tema Warna

Warna tema didefinisikan di `app/globals.css` via CSS variables — **jangan pernah pakai hardcoded hex atau `amber-*`**:

| Variable | Warna | Penggunaan |
|---|---|---|
| `--primary` | `oklch(0.8119 0.1696 77.4)` (gold) | CTA, badge, ikon aksen, hover state, tombol utama, teks aksen |
| `--secondary` | `oklch(0.3306 0.0787 157.04)` (teal gelap) | Background gelap (navbar scroll, stats, fasilitas, CTA section, footer) |

Gunakan Tailwind classes `bg-primary`, `text-primary`, `hover:text-primary`, `bg-secondary`, `text-secondary`, `text-primary-foreground`, `text-secondary-foreground`. Jangan gunakan `text-amber-*`, `bg-amber-*`, `#0a2a1a`, `#061a0f`, `#d4a017`, dll.


## Rules
- setiap perubahan update README.md
- dont use "any"
- gunakan bun sebagai package manager
- handle error dengan clean architecture
- gunakan shadcn ui, react hook form dan prisma untuk project ini
- gunakan clientside fetching dan actions dari nextjs 16
- proxy.ts untuk middleware

contoh script form.tsx:
```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})

export function BugReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ... */}
      {/* Build the form here */}
      {/* ... */}
    </form>
  )
}
```