"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateStudentScores } from "./actions";

const initialState = { success: false, message: "" };

type ScoreFormProps = {
  studentId: string;
  testBahasaInggris: number | null;
  testKarakter: number | null;
  testAkademik: number | null;
};

export function ScoreForm({ studentId, testBahasaInggris, testKarakter, testAkademik }: ScoreFormProps) {
  const [state, formAction, pending] = useActionState(updateStudentScores, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-4 items-end">
      <input type="hidden" name="studentId" value={studentId} />
      <label className="space-y-2 text-sm font-medium">
        Tes Bahasa Inggris
        <Input name="testBahasaInggris" type="number" min={1} max={100} required defaultValue={testBahasaInggris ?? ""} />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Tes Karakter
        <Input name="testKarakter" type="number" min={1} max={100} required defaultValue={testKarakter ?? ""} />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Tes Akademik
        <Input name="testAkademik" type="number" min={1} max={100} required defaultValue={testAkademik ?? ""} />
      </label>
      <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan Nilai"}</Button>
      {state.message && <p className="text-sm text-muted-foreground sm:col-span-3" aria-live="polite">{state.message}</p>}
    </form>
  );
}
