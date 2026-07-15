import { Card, CardContent } from "@/components/ui/card";
import { getCriteria } from "@/app/actions/criteria";
import CriteriaClient from "./criteria-client";

export default async function CriteriaPage() {
  const criteria = await getCriteria();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Data Kriteria</h2>
        <p className="text-muted-foreground">Kelola data kriteria untuk perhitungan algoritma SAW.</p>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-border/50 flex-1">
        <CardContent className="p-6">
          <CriteriaClient initialData={criteria} />
        </CardContent>
      </Card>
    </div>
  );
}
