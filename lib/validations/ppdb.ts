import { z } from "zod";

export const GENDER_OPTIONS = [
    { value: "MALE", label: "Laki-laki" },
    { value: "FEMALE", label: "Perempuan" },
] as const;

export const AGAMA_OPTIONS = [
    { value: "ISLAM", label: "Islam" },
    { value: "CHRISTIAN", label: "Kristen" },
    { value: "CATHOLIC", label: "Katolik" },
    { value: "HINDU", label: "Hindu" },
    { value: "BUDDHA", label: "Buddha" },
    { value: "KONGHUCU", label: "Konghucu" },
] as const;

export const KEADAAN_ORTU_OPTIONS = [
    { value: "LENGKAP", label: "Lengkap" },
    { value: "YATIM", label: "Yatim" },
    { value: "PIATU", label: "Piatu" },
    { value: "YATIM_PIATU", label: "Yatim Piatu" },
] as const;

export const STATUS_KELUARGA_OPTIONS = [
    { value: "ANAK_KANDUNG", label: "Anak Kandung" },
    { value: "ANAK_TIRI", label: "Anak Tiri" },
    { value: "ANAK_ANGKAT", label: "Anak Angkat" },
] as const;

export const TINGGAL_BERSAMA_OPTIONS = [
    { value: "ORANG_TUA", label: "Orang Tua" },
    { value: "KAKEK_NENEK", label: "Kakek/Nenek" },
    { value: "PAMAN_BIBI", label: "Paman/Bibi" },
    { value: "SAUDARA_KANDUNG", label: "Saudara Kandung" },
    { value: "KERABAT", label: "Kerabat" },
    { value: "PANTI_PONTREN", label: "Panti/Pondok Pesantren" },
    { value: "LAINNYA", label: "Lainnya" },
] as const;

export const BLOOD_TYPE_OPTIONS = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
    { value: "UNKNOWN", label: "Tidak Tahu" },
] as const;

export const EDUCATION_OPTIONS = [
    { value: "Tidak Sekolah", label: "Tidak Sekolah" },
    { value: "SD/MI", label: "SD/MI" },
    { value: "SMP/MTs", label: "SMP/MTs" },
    { value: "SMA/SMK/MA", label: "SMA/SMK/MA" },
    { value: "D1/D2/D3", label: "D1/D2/D3" },
    { value: "S1", label: "S1" },
    { value: "S2/S3", label: "S2/S3" },
] as const;

export const KEWARGANEGARAAN_OPTIONS = [
    { value: "WNI", label: "WNI (Warga Negara Indonesia)" },
    { value: "WNA", label: "WNA (Warga Negara Asing)" },
] as const;

export const PPDBSchema = z.object({
    batchId: z.number({ required_error: "Gelombang pendaftaran wajib dipilih" }),

    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter").trim(),
    nisn: z.string().optional().nullable(),
    nik: z.string().length(16, "NIK harus 16 digit"),
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi").trim(),
    tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
    gender: z.enum(["MALE", "FEMALE"] as const, { required_error: "Jenis kelamin wajib dipilih" }),
    agama: z.enum(["ISLAM", "CHRISTIAN", "CATHOLIC", "HINDU", "BUDDHA", "KONGHUCU"] as const, { required_error: "Agama wajib dipilih" }),
    kewarganegaraan: z.enum(["WNI", "WNA"] as const, { required_error: "Kewarganegaraan wajib diisi" }),
    asalSekolah: z.string().min(1, "Asal sekolah wajib diisi").trim(),

    keadaanOrtu: z.enum(["LENGKAP", "YATIM", "PIATU", "YATIM_PIATU"] as const, { required_error: "Keadaan orang tua wajib dipilih" }),
    statusKeluarga: z.enum(["ANAK_KANDUNG", "ANAK_TIRI", "ANAK_ANGKAT"] as const, { required_error: "Status keluarga wajib dipilih" }),
    anakKe: z.number().int().positive().optional().nullable(),
    dariBersaudara: z.number().int().positive().optional().nullable(),
    tinggalBersama: z.enum(["ORANG_TUA", "KAKEK_NENEK", "PAMAN_BIBI", "SAUDARA_KANDUNG", "KERABAT", "PANTI_PONTREN", "LAINNYA"] as const, { required_error: "Tinggal bersama wajib dipilih" }),
    bloodType: z.enum(["A", "B", "AB", "O", "UNKNOWN"] as const).optional().nullable(),
    beratKg: z.number().int().positive().optional().nullable(),
    tinggiCm: z.number().int().positive().optional().nullable(),
    riwayatPenyakit: z.string().optional().nullable(),

    alamatJalan: z.string().optional().nullable(),
    rt: z.string().optional().nullable(),
    rw: z.string().optional().nullable(),
    desaKelurahan: z.string().min(1, "Desa/Kelurahan wajib diisi"),
    kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
    kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
    provinsi: z.string().min(1, "Provinsi wajib diisi"),
    kodePos: z.string().min(1, "Kode pos wajib diisi"),
    phone: z.string().min(10, "Nomor HP minimal 10 digit"),
    email: z.string().email("Format email tidak valid").optional().nullable().or(z.literal("")),

    fatherName: z.string().min(1, "Nama ayah wajib diisi"),
    fatherEducation: z.string().min(1, "Pendidikan ayah wajib diisi"),
    fatherJob: z.string().min(1, "Pekerjaan ayah wajib diisi"),
    fatherIncome: z.string().min(1, "Penghasilan ayah wajib diisi"),
    motherName: z.string().min(1, "Nama ibu wajib diisi"),
    motherEducation: z.string().min(1, "Pendidikan ibu wajib diisi"),
    motherJob: z.string().min(1, "Pekerjaan ibu wajib diisi"),
    motherIncome: z.string().min(1, "Penghasilan ibu wajib diisi"),
    waliName: z.string().min(1, "Nama wali wajib diisi"),
    waliPhone: z.string().min(10, "Nomor HP wali minimal 10 digit"),
    waliEmail: z.string().email("Email wali tidak valid"),
    waliAlamat: z.string().min(1, "Alamat wali wajib diisi"),
});

export type PPDBFormValues = z.infer<typeof PPDBSchema>;
