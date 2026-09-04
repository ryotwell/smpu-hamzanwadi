"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { PPDBSchema, PPDBFormValues } from "@/lib/validations/ppdb";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { generateKodePendaftaran } from "@/lib/ppdb-registration-code";

// ── Upload helper ───────────────────────────────────────────────────────────

async function uploadFile(file: File, folder: string): Promise<string> {
    const ext = file.name.split(".").pop();
    const key = `${folder}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    );

    const endpoint = process.env.S3_ENDPOINT!.replace(/\/$/, "");
    return `${endpoint}/${process.env.S3_BUCKET_NAME}/${key}`;
}

// ── Action state types ──────────────────────────────────────────────────────

export type PPDBActionState =
    | { success: true; studentId: string }
    | { success: false; message: string; errors?: Record<string, string[]> }
    | undefined;

// ── Create student (public PPDB) ────────────────────────────────────────────

export async function createStudentAction(formData: FormData): Promise<PPDBActionState> {
    // Parse text fields
    const raw: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) continue;

        // Coerce numeric fields
        const numericFields = ["batchId", "anakKe", "dariBersaudara", "beratKg", "tinggiCm", "jarakRumahSekolah", "rataRataRaport"];
        if (numericFields.includes(key)) {
            const num = Number(value);
            raw[key] = value === "" ? null : isNaN(num) ? null : num;
        } else {
            raw[key] = value === "" ? null : value;
        }
    }

    const validated = PPDBSchema.safeParse(raw);
    if (!validated.success) {
        return {
            success: false,
            message: "Data tidak valid. Periksa kembali formulir.",
            errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    const data = validated.data as PPDBFormValues;

    // Validate required files
    const photoFile = formData.get("photo") as File | null;
    const kartuKeluargaFile = formData.get("kartuKeluarga") as File | null;
    const aktaKelahiranFile = formData.get("aktaKelahiran") as File | null;
    const ijazahSKLFile = formData.get("ijazahSKL") as File | null;
    const prestasiFile = formData.get("prestasi") as File | null;

    if (!photoFile?.size || !kartuKeluargaFile?.size || !aktaKelahiranFile?.size || !ijazahSKLFile?.size) {
        return { success: false, message: "Dokumen wajib (foto, KK, akta, ijazah) harus diunggah." };
    }

    try {
        // Upload files to S3
        const [photoUrl, kartuKeluargaUrl, aktaKelahiranUrl, ijazahSKLUrl, prestasiUrl] = await Promise.all([
            uploadFile(photoFile, "ppdb/photo"),
            uploadFile(kartuKeluargaFile, "ppdb/kartu-keluarga"),
            uploadFile(aktaKelahiranFile, "ppdb/akta-kelahiran"),
            uploadFile(ijazahSKLFile, "ppdb/ijazah-skl"),
            prestasiFile?.size ? uploadFile(prestasiFile, "ppdb/prestasi") : Promise.resolve(null),
        ]);

        // Create records in transaction: File → Parent → Student
        const student = await prisma.$transaction(async (tx) => {
            // Determine nomor urut (count existing students + 1, safe within serializable tx)
            const count = await tx.student.count();
            const noUrutPendaftaran = count + 1;
            const kodePendaftaran = generateKodePendaftaran(data.batchId, noUrutPendaftaran);

            const fileRecord = await tx.file.create({
                data: {
                    photo: photoUrl,
                    kartuKeluarga: kartuKeluargaUrl,
                    aktaKelahiran: aktaKelahiranUrl,
                    ijazahSKL: ijazahSKLUrl,
                    prestasi: prestasiUrl,
                },
            });

            const parentRecord = await tx.parent.create({
                data: {
                    fatherName: data.fatherName,
                    fatherEducation: data.fatherEducation,
                    fatherJob: data.fatherJob,
                    fatherIncome: data.fatherIncome,
                    motherName: data.motherName,
                    motherEducation: data.motherEducation,
                    motherJob: data.motherJob,
                    motherIncome: data.motherIncome,
                    waliName: data.waliName,
                    waliPhone: data.waliPhone,
                    waliEmail: data.waliEmail,
                    waliAlamat: data.waliAlamat,
                },
            });

            return tx.student.create({
                data: {
                    kodePendaftaran,
                    noUrutPendaftaran,
                    fullName: data.fullName,
                    nisn: data.nisn ?? null,
                    nik: data.nik,
                    tempatLahir: data.tempatLahir,
                    tanggalLahir: data.tanggalLahir,
                    gender: data.gender,
                    agama: data.agama,
                    keadaanOrtu: data.keadaanOrtu,
                    statusKeluarga: data.statusKeluarga,
                    anakKe: data.anakKe ?? null,
                    dariBersaudara: data.dariBersaudara ?? null,
                    tinggalBersama: data.tinggalBersama,
                    bloodType: data.bloodType ?? null,
                    beratKg: data.beratKg ?? null,
                    tinggiCm: data.tinggiCm ?? null,
                    riwayatPenyakit: data.riwayatPenyakit ?? null,
                    asalSekolah: data.asalSekolah,
                    kewarganegaraan: data.kewarganegaraan,
                    alamatJalan: data.alamatJalan ?? null,
                    rt: data.rt ?? null,
                    rw: data.rw ?? null,
                    desaKelurahan: data.desaKelurahan,
                    kecamatan: data.kecamatan,
                    kabupaten: data.kabupaten,
                    provinsi: data.provinsi,
                    kodePos: data.kodePos,
                    phone: data.phone,
                    email: data.email ?? null,
                    // ── FIELD BARU ──
                    jarakRumahSekolah: data.jarakRumahSekolah ?? null,
                    alamatLengkap: data.alamatLengkap ?? null,
                    rataRataRaport: data.rataRataRaport ?? null,
                    parentId: parentRecord.id,
                    fileId: fileRecord.id,
                    batchId: data.batchId,
                },
            });
        });

        redirect(`/ppdb/success?id=${student.id}`);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
        console.error("[createStudentAction]", error);
        return { success: false, message: "Terjadi kesalahan server. Silakan coba lagi." };
    }
}

// ── Update student (admin edit) ─────────────────────────────────────────────

export async function updateStudentAction(
    studentId: string,
    formData: FormData
): Promise<PPDBActionState> {
    const raw: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) continue;
        const numericFields = ["batchId", "anakKe", "dariBersaudara", "beratKg", "tinggiCm", "jarakRumahSekolah", "rataRataRaport"];
        if (numericFields.includes(key)) {
            const num = Number(value);
            raw[key] = value === "" ? null : isNaN(num) ? null : num;
        } else {
            raw[key] = value === "" ? null : value;
        }
    }

    const validated = PPDBSchema.safeParse(raw);
    if (!validated.success) {
        return {
            success: false,
            message: "Data tidak valid.",
            errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    const data = validated.data as PPDBFormValues;

    // Get existing student to find file/parent IDs
    const existing = await prisma.student.findUnique({
        where: { id: studentId },
        include: { file: true, parent: true },
    });
    if (!existing) return { success: false, message: "Data siswa tidak ditemukan." };

    try {
        // Upload new files if provided
        async function maybeUpload(field: string, folder: string, existingUrl: string): Promise<string> {
            const file = formData.get(field) as File | null;
            if (file?.size) return uploadFile(file, folder);
            return existingUrl;
        }

        const [photoUrl, kartuKeluargaUrl, aktaKelahiranUrl, ijazahSKLUrl] = await Promise.all([
            maybeUpload("photo", "ppdb/photo", existing.file.photo),
            maybeUpload("kartuKeluarga", "ppdb/kartu-keluarga", existing.file.kartuKeluarga),
            maybeUpload("aktaKelahiran", "ppdb/akta-kelahiran", existing.file.aktaKelahiran),
            maybeUpload("ijazahSKL", "ppdb/ijazah-skl", existing.file.ijazahSKL),
        ]);

        const prestasiFile = formData.get("prestasi") as File | null;
        const prestasiUrl = prestasiFile?.size
            ? await uploadFile(prestasiFile, "ppdb/prestasi")
            : existing.file.prestasi ?? null;

        await prisma.$transaction(async (tx) => {
            await tx.file.update({
                where: { id: existing.fileId },
                data: {
                    photo: photoUrl,
                    kartuKeluarga: kartuKeluargaUrl,
                    aktaKelahiran: aktaKelahiranUrl,
                    ijazahSKL: ijazahSKLUrl,
                    prestasi: prestasiUrl,
                },
            });

            await tx.parent.update({
                where: { id: existing.parentId },
                data: {
                    fatherName: data.fatherName,
                    fatherEducation: data.fatherEducation,
                    fatherJob: data.fatherJob,
                    fatherIncome: data.fatherIncome,
                    motherName: data.motherName,
                    motherEducation: data.motherEducation,
                    motherJob: data.motherJob,
                    motherIncome: data.motherIncome,
                    waliName: data.waliName,
                    waliPhone: data.waliPhone,
                    waliEmail: data.waliEmail,
                    waliAlamat: data.waliAlamat,
                },
            });

            await tx.student.update({
                where: { id: studentId },
                data: {
                    fullName: data.fullName,
                    nisn: data.nisn ?? null,
                    nik: data.nik,
                    tempatLahir: data.tempatLahir,
                    tanggalLahir: data.tanggalLahir,
                    gender: data.gender,
                    agama: data.agama,
                    keadaanOrtu: data.keadaanOrtu,
                    statusKeluarga: data.statusKeluarga,
                    anakKe: data.anakKe ?? null,
                    dariBersaudara: data.dariBersaudara ?? null,
                    tinggalBersama: data.tinggalBersama,
                    bloodType: data.bloodType ?? null,
                    beratKg: data.beratKg ?? null,
                    tinggiCm: data.tinggiCm ?? null,
                    riwayatPenyakit: data.riwayatPenyakit ?? null,
                    asalSekolah: data.asalSekolah,
                    kewarganegaraan: data.kewarganegaraan,
                    alamatJalan: data.alamatJalan ?? null,
                    rt: data.rt ?? null,
                    rw: data.rw ?? null,
                    desaKelurahan: data.desaKelurahan,
                    kecamatan: data.kecamatan,
                    kabupaten: data.kabupaten,
                    provinsi: data.provinsi,
                    kodePos: data.kodePos,
                    phone: data.phone,
                    email: data.email ?? null,
                    // ── FIELD BARU ──
                    jarakRumahSekolah: data.jarakRumahSekolah ?? null,
                    alamatLengkap: data.alamatLengkap ?? null,
                    rataRataRaport: data.rataRataRaport ?? null,
                    batchId: data.batchId,
                },
            });
        });

        return { success: true, studentId };
    } catch (error: unknown) {
        console.error("[updateStudentAction]", error);
        return { success: false, message: "Terjadi kesalahan server. Silakan coba lagi." };
    }
}