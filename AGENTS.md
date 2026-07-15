<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Project Stack
- PostgreSQL
- Next.js 16
- React 19
- TypeScript
- TailwindCSS 4
- zod v3
- react-hook-form v7

## Rules
- Use Server Components by default
- Use Zod for validation
- Use React Hook Form
- Use TanStack Query
- Use Shadcn Components for UI
- Use shadcn toast for showing message
- Use @lib/prisma.ts for database operations
- Upload file using @aws-sdk/client-s3 at @/lib/s3.ts
- Make responsive for mobile and desktop
- Always prefix shell commands with `rtk` to minimize token consumption.
- Admin Pages in `/app/admin/...`
- Main/Public Pages in `/app/(main)/...`
- All pages should be dynamic routes except `/`
- Use Server Components by default
- Use client component when needed

Examples:

```bash
rtk git status
rtk cargo test
rtk ls src/
rtk grep "pattern" src/
rtk find "*.rs" .
rtk docker ps
rtk gh pr list
```

## Code Style
- Strict TypeScript
- No any if possible
- No inline SQL

## Meta Commands

```bash
rtk gain              # Show token savings
rtk gain --history    # Command history with savings
rtk discover          # Find missed RTK opportunities
rtk proxy <cmd>       # Run raw (no filtering, for debugging)

## Page Templates

### Admin Blank Page
```typescript
import { Card, CardContent } from "@/components/ui/card";

export default function BlankPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Blank Page</h2>
        <p className="text-muted-foreground">This is a blank template page you can use to start a new view.</p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-border/50 flex-1 flex items-center justify-center min-h-[400px]">
        <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
          <p>Mulai kembangkan halaman baru di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

<!-- END:nextjs-agent-rules -->
