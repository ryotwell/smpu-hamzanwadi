"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
    PPDBSchema, PPDBFormValues,
    GENDER_OPTIONS, AGAMA_OPTIONS, KEADAAN_ORTU_OPTIONS,
    STATUS_KELUARGA_OPTIONS, TINGGAL_BERSAMA_OPTIONS,
    BLOOD_TYPE_OPTIONS, EDUCATION_OPTIONS, KEWARGANEGARAAN_OPTIONS,
} from "@/lib/validations/ppdb";
import { createStudentAction, updateStudentAction } from "@/app/actions/ppdb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2, Upload } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

interface Batch { id: number; name: string; jalur: string }

export interface StudentFormProps {
    mode: "create" | "edit";
    batches: Batch[];
    defaultValues?: Partial<PPDBFormValues>;
    studentId?: string;
    existingFiles?: {
        photo?: string;
        kartuKeluarga?: string;
        aktaKelahiran?: string;
        ijazahSKL?: string;
        prestasi?: string;
    };
    onSuccess?: (studentId: string) => void;
}

// ── Primitive helpers ───────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="col-span-full text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2 mt-2">
            {children}
        </h3>
    );
}

function Field({
    id, label, error, required, full, children,
}: {
    id?: string; label: string; error?: string; required?: boolean; full?: boolean; children: React.ReactNode;
}) {
    return (
        <div className={cn("grid gap-1.5", full && "col-span-full")}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

function TextInput({ id, label, error, required, full, ...rest }: {
    id: string; label: string; error?: string; required?: boolean; full?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <Field id={id} label={label} error={error} required={required} full={full}>
            <Input id={id} className={cn(error && "border-destructive")} {...rest} />
        </Field>
    );
}

function SelectInput({ id, label, options, error, required, full, ...rest }: {
    id: string; label: string; options: { value: string; label: string }[];
    error?: string; required?: boolean; full?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <Field id={id} label={label} error={error} required={required} full={full}>
            <select
                id={id}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-destructive"
                )}
                {...rest}
            >
                <option value="">-- Pilih --</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </Field>
    );
}

function TextareaInput({ id, label, error, required, full, ...rest }: {
    id: string; label: string; error?: string; required?: boolean; full?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <Field id={id} label={label} error={error} required={required} full={full}>
            <textarea
                id={id}
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none",
                    error && "border-destructive"
                )}
                {...rest}
            />
        </Field>
    );
}

function FileInput({ id, label, required, existingUrl, onChange }: {
    id: string; label: string; required?: boolean; existingUrl?: string;
    onChange: (f: File | null) => void;
}) {
    const [fileName, setFileName] = useState<string | null>(existingUrl ? "File tersimpan" : null);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Field id={id} label={label} required={required}>
            <div
                className="flex items-center gap-3 p-3 rounded-md border border-dashed border-input hover:border-primary/60 cursor-pointer transition-colors"
                onClick={() => inputRef.current?.click()}
            >
                <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
                    {fileName ?? "Klik untuk memilih file"}
                </span>
                {existingUrl && (
                    <a
                        href={existingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-xs text-primary underline shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Lihat
                    </a>
                )}
            </div>
            <input
                ref={inputRef}
                id={id}
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFileName(f?.name ?? null);
                    onChange(f);
                }}
            />
        </Field>
    );
}

// ── Main form ───────────────────────────────────────────────────────────────

export function StudentForm({
    mode, batches, defaultValues, studentId, existingFiles, onSuccess,
}: StudentFormProps) {
    const [isPending, startTransition] = useTransition();
    const [files, setFiles] = useState<Record<string, File | null>>({
        photo: null, kartuKeluarga: null, aktaKelahiran: null, ijazahSKL: null, prestasi: null,
    });

    const { register, handleSubmit, formState: { errors } } = useForm<PPDBFormValues>({
        resolver: zodResolver(PPDBSchema),
        defaultValues: { kewarganegaraan: "WNI", ...defaultValues },
    });

    const e = errors as Record<string, { message?: string }>;

    const onSubmit = (data: PPDBFormValues) => {
        if (mode === "create") {
            const missing = (["photo", "kartuKeluarga", "aktaKelahiran", "ijazahSKL"] as const)
                .filter((k) => !files[k]);
            if (missing.length > 0) {
                toast.error("Harap upload semua dokumen wajib (foto, KK, akta, ijazah).");
                return;
            }
        }

        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (v !== null && v !== undefined) formData.append(k, String(v));
        });
        Object.entries(files).forEach(([k, v]) => { if (v) formData.append(k, v); });

        startTransition(async () => {
            const result = mode === "create"
                ? await createStudentAction(formData)
                : await updateStudentAction(studentId!, formData);

            if (!result) return;
            if (!result.success) {
                toast.error(result.message);
            } else {
                toast.success(mode === "edit" ? "Data berhasil diperbarui." : "Pendaftaran berhasil dikirim!");
                onSuccess?.(result.studentId);
            }
        });
    };

    const numReg = (name: keyof PPDBFormValues) =>
        register(name, { setValueAs: (v: string) => v === "" ? null : Number(v) });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* ── Gelombang ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Gelombang Pendaftaran</SectionTitle>
                <SelectInput
                    id="batchId" label="Gelombang" required full
                    options={batches.map((b) => ({ value: String(b.id), label: `${b.name} — ${b.jalur}` }))}
                    error={e.batchId?.message}
                    {...register("batchId", { setValueAs: (v) => v === "" ? undefined : Number(v) })}
                />
            </div>

            {/* ── Data Diri ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Data Diri Siswa</SectionTitle>
                <TextInput id="fullName" label="Nama Lengkap" required full placeholder="Sesuai akta kelahiran" error={e.fullName?.message} {...register("fullName")} />
                <TextInput id="nik" label="NIK" required placeholder="16 digit" maxLength={16} error={e.nik?.message} {...register("nik")} />
                <TextInput id="nisn" label="NISN" placeholder="Opsional" error={e.nisn?.message} {...register("nisn")} />
                <TextInput id="tempatLahir" label="Tempat Lahir" required error={e.tempatLahir?.message} {...register("tempatLahir")} />
                <TextInput id="tanggalLahir" label="Tanggal Lahir" required type="date" error={e.tanggalLahir?.message} {...register("tanggalLahir")} />
                <SelectInput id="gender" label="Jenis Kelamin" required options={[...GENDER_OPTIONS]} error={e.gender?.message} {...register("gender")} />
                <SelectInput id="agama" label="Agama" required options={[...AGAMA_OPTIONS]} error={e.agama?.message} {...register("agama")} />
                <SelectInput id="kewarganegaraan" label="Kewarganegaraan" required options={[...KEWARGANEGARAAN_OPTIONS]} error={e.kewarganegaraan?.message} {...register("kewarganegaraan")} />
                <TextInput id="asalSekolah" label="Asal Sekolah" required full error={e.asalSekolah?.message} {...register("asalSekolah")} />
            </div>

            {/* ── Kondisi Keluarga & Kesehatan ─────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Kondisi Keluarga & Kesehatan</SectionTitle>
                <SelectInput id="keadaanOrtu" label="Keadaan Orang Tua" required options={[...KEADAAN_ORTU_OPTIONS]} error={e.keadaanOrtu?.message} {...register("keadaanOrtu")} />
                <SelectInput id="statusKeluarga" label="Status Keluarga" required options={[...STATUS_KELUARGA_OPTIONS]} error={e.statusKeluarga?.message} {...register("statusKeluarga")} />
                <SelectInput id="tinggalBersama" label="Tinggal Bersama" required options={[...TINGGAL_BERSAMA_OPTIONS]} error={e.tinggalBersama?.message} {...register("tinggalBersama")} />
                <TextInput id="anakKe" label="Anak Ke-" type="number" min={1} placeholder="Contoh: 2" error={e.anakKe?.message} {...numReg("anakKe")} />
                <TextInput id="dariBersaudara" label="Dari Bersaudara" type="number" min={1} placeholder="Contoh: 3" error={e.dariBersaudara?.message} {...numReg("dariBersaudara")} />
                <SelectInput id="bloodType" label="Golongan Darah" options={[...BLOOD_TYPE_OPTIONS]} error={e.bloodType?.message} {...register("bloodType")} />
                <TextInput id="beratKg" label="Berat Badan (kg)" type="number" min={1} error={e.beratKg?.message} {...numReg("beratKg")} />
                <TextInput id="tinggiCm" label="Tinggi Badan (cm)" type="number" min={1} error={e.tinggiCm?.message} {...numReg("tinggiCm")} />
                <TextareaInput id="riwayatPenyakit" label="Riwayat Penyakit" full placeholder="Opsional — tulis jika ada" error={e.riwayatPenyakit?.message} {...register("riwayatPenyakit")} />
            </div>

            {/* ── Alamat & Kontak ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Alamat & Kontak</SectionTitle>
                <TextInput id="alamatJalan" label="Jalan / Dusun" full placeholder="Nama jalan, nomor rumah, dusun" error={e.alamatJalan?.message} {...register("alamatJalan")} />
                <TextInput id="rt" label="RT" placeholder="001" error={e.rt?.message} {...register("rt")} />
                <TextInput id="rw" label="RW" placeholder="002" error={e.rw?.message} {...register("rw")} />
                <TextInput id="desaKelurahan" label="Desa / Kelurahan" required error={e.desaKelurahan?.message} {...register("desaKelurahan")} />
                <TextInput id="kecamatan" label="Kecamatan" required error={e.kecamatan?.message} {...register("kecamatan")} />
                <TextInput id="kabupaten" label="Kabupaten / Kota" required error={e.kabupaten?.message} {...register("kabupaten")} />
                <TextInput id="provinsi" label="Provinsi" required error={e.provinsi?.message} {...register("provinsi")} />
                <TextInput id="kodePos" label="Kode Pos" required error={e.kodePos?.message} {...register("kodePos")} />
                <TextInput id="phone" label="Nomor HP / WhatsApp" required type="tel" error={e.phone?.message} {...register("phone")} />
                <TextInput id="email" label="Email" type="email" placeholder="Opsional" error={e.email?.message} {...register("email")} />
            </div>

            {/* ── Data Ayah ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Data Ayah</SectionTitle>
                <TextInput id="fatherName" label="Nama Ayah" required error={e.fatherName?.message} {...register("fatherName")} />
                <SelectInput id="fatherEducation" label="Pendidikan Ayah" required options={[...EDUCATION_OPTIONS]} error={e.fatherEducation?.message} {...register("fatherEducation")} />
                <TextInput id="fatherJob" label="Pekerjaan Ayah" required error={e.fatherJob?.message} {...register("fatherJob")} />
                <TextInput id="fatherIncome" label="Penghasilan Ayah" required placeholder="Contoh: 2.000.000 - 3.000.000" error={e.fatherIncome?.message} {...register("fatherIncome")} />
            </div>

            {/* ── Data Ibu ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Data Ibu</SectionTitle>
                <TextInput id="motherName" label="Nama Ibu" required error={e.motherName?.message} {...register("motherName")} />
                <SelectInput id="motherEducation" label="Pendidikan Ibu" required options={[...EDUCATION_OPTIONS]} error={e.motherEducation?.message} {...register("motherEducation")} />
                <TextInput id="motherJob" label="Pekerjaan Ibu" required error={e.motherJob?.message} {...register("motherJob")} />
                <TextInput id="motherIncome" label="Penghasilan Ibu" required placeholder="Contoh: 1.000.000 - 2.000.000" error={e.motherIncome?.message} {...register("motherIncome")} />
            </div>

            {/* ── Data Wali ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Data Wali</SectionTitle>
                <TextInput id="waliName" label="Nama Wali" required error={e.waliName?.message} {...register("waliName")} />
                <TextInput id="waliPhone" label="HP Wali" required type="tel" error={e.waliPhone?.message} {...register("waliPhone")} />
                <TextInput id="waliEmail" label="Email Wali" required type="email" error={e.waliEmail?.message} {...register("waliEmail")} />
                <TextareaInput id="waliAlamat" label="Alamat Wali" required full error={e.waliAlamat?.message} {...register("waliAlamat")} />
            </div>

            {/* ── Dokumen ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectionTitle>Upload Dokumen</SectionTitle>
                <p className="col-span-full text-sm text-muted-foreground -mt-2">
                    Format diterima: JPG, PNG, PDF. Ukuran maks. 5MB per file.
                </p>
                <FileInput id="photo" label="Pas Foto" required existingUrl={existingFiles?.photo} onChange={(f) => setFiles((p) => ({ ...p, photo: f }))} />
                <FileInput id="kartuKeluarga" label="Kartu Keluarga (KK)" required existingUrl={existingFiles?.kartuKeluarga} onChange={(f) => setFiles((p) => ({ ...p, kartuKeluarga: f }))} />
                <FileInput id="aktaKelahiran" label="Akta Kelahiran" required existingUrl={existingFiles?.aktaKelahiran} onChange={(f) => setFiles((p) => ({ ...p, aktaKelahiran: f }))} />
                <FileInput id="ijazahSKL" label="Ijazah / SKL" required existingUrl={existingFiles?.ijazahSKL} onChange={(f) => setFiles((p) => ({ ...p, ijazahSKL: f }))} />
                <FileInput id="prestasi" label="Sertifikat Prestasi (Opsional)" existingUrl={existingFiles?.prestasi} onChange={(f) => setFiles((p) => ({ ...p, prestasi: f }))} />
            </div>

            {/* ── Submit ───────────────────────────────────────────────────── */}
            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={isPending} className="min-w-40 gap-2">
                    {isPending
                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…</>
                        : mode === "edit" ? "Simpan Perubahan" : "Kirim Pendaftaran"
                    }
                </Button>
            </div>
        </form>
    );
}
