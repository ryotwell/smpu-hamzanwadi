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
