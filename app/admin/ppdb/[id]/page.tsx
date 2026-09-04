import { ScoreForm } from "../score-form";

// app/admin/ppdb/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Users,
  School,
  BookOpen,
  Award,
  FileCheck,
  Clock,
  Image,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

// Fungsi helper untuk format tanggal
const formatDate = (date: string | Date | null) => {
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMMM yyyy", { locale: id });
  } catch {
    return String(date);
  }
};

// Label untuk enum
const genderLabel = {
  MALE: "Laki-laki",
  FEMALE: "Perempuan",
};

const religionLabel = {
  ISLAM: "Islam",
  CHRISTIAN: "Kristen",
  CATHOLIC: "Katolik",
  HINDU: "Hindu",
  BUDDHA: "Buddha",
  KONGHUCU: "Konghucu",
};

const statusKeluargaLabel = {
  ANAK_KANDUNG: "Anak Kandung",
  ANAK_TIRI: "Anak Tiri",
  ANAK_ANGKAT: "Anak Angkat",
};

const keadaanOrtuLabel = {
  LENGKAP: "Lengkap",
  YATIM: "Yatim",
  PIATU: "Piatu",
  YATIM_PIATU: "Yatim Piatu",
};

const tinggalBersamaLabel = {
  ORANG_TUA: "Orang Tua",
  KAKEK_NENEK: "Kakek/Nenek",
  PAMAN_BIBI: "Paman/Bibi",
  SAUDARA_KANDUNG: "Saudara Kandung",
  KERABAT: "Kerabat",
  PANTI_PONTREN: "Panti/Pondok Pesantren",
  LAINNYA: "Lainnya",
};

const bloodTypeLabel = {
  A: "A",
  B: "B",
  AB: "AB",
  O: "O",
  UNKNOWN: "Tidak Diketahui",
};

const kewarganegaraanLabel = {
  WNI: "WNI",
  WNA: "WNA",
};

const jalurLabel = {
  UMUM: "Umum",
  PRESTASI: "Prestasi",
};

export default async function StudentDetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      parent: true,
      file: true,
      batch: true,
    },
  });

  if (!student) {
    notFound();
  }

  const statusBadge = student.isAccepted ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
      <FileCheck className="mr-1 h-3 w-3" />
      Diterima
    </Badge>
  ) : (
    <Badge variant="outline">
      <Clock className="mr-1 h-3 w-3" />
      Menunggu
    </Badge>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/ppdb">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detail Pendaftar</h1>
            <p className="text-muted-foreground">
              {student.fullName} - {student.kodePendaftaran}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Data
          </Button>
          <Button size="sm">
            <FileCheck className="mr-2 h-4 w-4" />
            Verifikasi
          </Button>
        </div>
      </div>

      {/* Status & Info Singkat */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">{statusBadge}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <School className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Batch</p>
                <p className="font-semibold">{student.batch.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jalur</p>
                <p className="font-semibold">{jalurLabel[student.batch.jalur]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Daftar</p>
                <p className="font-semibold">{formatDate(student.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Pribadi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Data Pribadi
          </CardTitle>
          <CardDescription>Informasi lengkap calon siswa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nama Lengkap</p>
              <p className="font-medium">{student.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NISN</p>
              <p className="font-medium">{student.nisn || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NIK</p>
              <p className="font-medium">{student.nik}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempat, Tanggal Lahir</p>
              <p className="font-medium">
                {student.tempatLahir}, {formatDate(student.tanggalLahir)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
              <p className="font-medium">{genderLabel[student.gender]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Agama</p>
              <p className="font-medium">{religionLabel[student.agama]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kewarganegaraan</p>
              <p className="font-medium">{kewarganegaraanLabel[student.kewarganegaraan]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Golongan Darah</p>
              <p className="font-medium">{bloodTypeLabel[student.bloodType || "UNKNOWN"]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Berat / Tinggi</p>
              <p className="font-medium">
                {student.beratKg ? `${student.beratKg} kg` : "-"} /{" "}
                {student.tinggiCm ? `${student.tinggiCm} cm` : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Keluarga */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Data Keluarga
          </CardTitle>
          <CardDescription>Informasi keluarga dan orang tua.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Keluarga */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Informasi Keluarga</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Keadaan Orang Tua</p>
                  <p className="font-medium">{keadaanOrtuLabel[student.keadaanOrtu]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status Keluarga</p>
                  <p className="font-medium">{statusKeluargaLabel[student.statusKeluarga]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Anak Ke</p>
                  <p className="font-medium">{student.anakKe || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dari Bersaudara</p>
                  <p className="font-medium">{student.dariBersaudara || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Tinggal Bersama</p>
                  <p className="font-medium">{tinggalBersamaLabel[student.tinggalBersama]}</p>
                </div>
              </div>
            </div>

            {/* Data Orang Tua */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Data Orang Tua / Wali</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Ayah</p>
                  <p className="font-medium">{student.parent.fatherName}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendidikan</p>
                    <p className="font-medium text-sm">{student.parent.fatherEducation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pekerjaan</p>
                    <p className="font-medium text-sm">{student.parent.fatherJob}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Penghasilan</p>
                    <p className="font-medium text-sm">{student.parent.fatherIncome}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Ibu</p>
                  <p className="font-medium">{student.parent.motherName}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendidikan</p>
                    <p className="font-medium text-sm">{student.parent.motherEducation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pekerjaan</p>
                    <p className="font-medium text-sm">{student.parent.motherJob}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Penghasilan</p>
                    <p className="font-medium text-sm">{student.parent.motherIncome}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 border-t pt-3">
                <p className="text-sm font-medium">Data Wali</p>
                <div>
                  <p className="text-sm text-muted-foreground">Nama Wali</p>
                  <p className="font-medium">{student.parent.waliName}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p className="font-medium">{student.parent.waliPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{student.parent.waliEmail}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alamat Wali</p>
                  <p className="font-medium">{student.parent.waliAlamat}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alamat & Kontak */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat & Kontak
          </CardTitle>
          <CardDescription>Informasi alamat dan kontak siswa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">
                  {student.alamatJalan || "-"}
                  {student.rt && `, RT ${student.rt}`}
                  {student.rw && ` / RW ${student.rw}`}
                </p>
                <p className="font-medium">
                  {student.desaKelurahan}, {student.kecamatan}
                </p>
                <p className="font-medium">
                  {student.kabupaten}, {student.provinsi}
                </p>
                <p className="font-medium">Kode Pos: {student.kodePos}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Asal Sekolah</p>
                <p className="font-medium">{student.asalSekolah}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telepon</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {student.phone}
                </p>
              </div>
              {student.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {student.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Nilai Tes Seleksi
          </CardTitle>
          <CardDescription>Isi nilai dengan rentang 1 sampai 100.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreForm
            studentId={student.id}
            testBahasaInggris={student.testBahasaInggris}
            testKarakter={student.testKarakter}
            testAkademik={student.testAkademik}
          />
        </CardContent>
      </Card>


      <Card>
        <CardHeader>


          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Berkas Persyaratan
          </CardTitle>
          <CardDescription>Dokumen yang diupload oleh pendaftar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Foto</p>
              </div>
              {student.file.photo ? (
                <div className="relative w-full aspect-square rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={student.file.photo}
                    alt="Foto"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum diupload</p>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Kartu Keluarga</p>
              </div>
              {student.file.kartuKeluarga ? (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={student.file.kartuKeluarga} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-3 w-3" />
                    Lihat Dokumen
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Belum diupload</p>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Akta Kelahiran</p>
              </div>
              {student.file.aktaKelahiran ? (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={student.file.aktaKelahiran} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-3 w-3" />
                    Lihat Dokumen
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Belum diupload</p>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Ijazah / SKL</p>
              </div>
              {student.file.ijazahSKL ? (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={student.file.ijazahSKL} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-3 w-3" />
                    Lihat Dokumen
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">Belum diupload</p>
              )}
            </div>

            {student.file.prestasi && (
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Prestasi</p>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={student.file.prestasi} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-3 w-3" />
                    Lihat Dokumen
                  </a>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}