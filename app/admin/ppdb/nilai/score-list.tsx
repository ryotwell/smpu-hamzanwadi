"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateStudentScores } from "../actions";

const initialState = { success: false, message: "" };

type ScoreRowProps = {
  student: {
    id: string;
    fullName: string;
    kodePendaftaran: string;
    asalSekolah: string;
    testBahasaInggris: number | null;
    testKarakter: number | null;
    testAkademik: number | null;
  };
};

function ScoreRow({ student }: ScoreRowProps) {
  const [state, formAction, pending] = useActionState(updateStudentScores, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_180px_180px_180px_auto] md:items-end">
      <input type="hidden" name="studentId" value={student.id} />
      <div>
        <p className="font-medium">{student.fullName}</p>
        <p className="text-sm text-muted-foreground">{student.kodePendaftaran} · {student.asalSekolah}</p>
      </div>
      <label className="space-y-2 text-sm font-medium">
        Tes Akademik
        <Input name="testAkademik" type="number" min={1} max={100} required defaultValue={student.testAkademik ?? ""} />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Tes Bahasa Inggris
        <Input name="testBahasaInggris" type="number" min={1} max={100} required defaultValue={student.testBahasaInggris ?? ""} />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Tes Karakter

        <Input name="testKarakter" type="number" min={1} max={100} required defaultValue={student.testKarakter ?? ""} />
      </label>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan"}</Button>
        {state.message && <span className="text-xs text-muted-foreground" aria-live="polite">{state.message}</span>}
      </div>
    </form>
  );
}

export function ScoreList({ students }: { students: ScoreRowProps["student"][] }) {
  return <div className="space-y-3">{students.map((student) => <ScoreRow key={student.id} student={student} />)}</div>;
}
