-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A', 'B', 'AB', 'O', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TinggalBersama" AS ENUM ('ORANG_TUA', 'KAKEK_NENEK', 'PAMAN_BIBI', 'SAUDARA_KANDUNG', 'KERABAT', 'PANTI_PONTREN', 'LAINNYA');

-- CreateEnum
CREATE TYPE "FamilyStatus" AS ENUM ('ANAK_KANDUNG', 'ANAK_TIRI', 'ANAK_ANGKAT');

-- CreateEnum
CREATE TYPE "KeadaanOrtu" AS ENUM ('LENGKAP', 'YATIM', 'PIATU', 'YATIM_PIATU');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('ISLAM', 'CHRISTIAN', 'CATHOLIC', 'HINDU', 'BUDDHA', 'KONGHUCU');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('BERITA', 'ARTIKEL', 'INFORMASI');

-- CreateEnum
CREATE TYPE "CurriculumCategory" AS ENUM ('EXTRACURRICULAR', 'PROGRAM_UNGGULAN', 'KO_CULLICULAR');

-- CreateEnum
CREATE TYPE "JalurPendaftaran" AS ENUM ('UMUM', 'PRESTASI');

-- CreateEnum
CREATE TYPE "Kewarganegaraan" AS ENUM ('WNI', 'WNA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fatherName" TEXT NOT NULL,
    "fatherEducation" TEXT NOT NULL,
    "fatherJob" TEXT NOT NULL,
    "fatherIncome" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "motherEducation" TEXT NOT NULL,
    "motherJob" TEXT NOT NULL,
    "motherIncome" TEXT NOT NULL,
    "waliName" TEXT NOT NULL,
    "waliPhone" TEXT NOT NULL,
    "waliEmail" TEXT NOT NULL,
    "waliAlamat" TEXT NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "photo" TEXT NOT NULL,
    "kartuKeluarga" TEXT NOT NULL,
    "aktaKelahiran" TEXT NOT NULL,
    "ijazahSKL" TEXT NOT NULL,
    "prestasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "kodePendaftaran" TEXT NOT NULL,
    "noUrutPendaftaran" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "nisn" TEXT,
    "nik" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "agama" "Religion" NOT NULL,
    "keadaanOrtu" "KeadaanOrtu" NOT NULL,
    "statusKeluarga" "FamilyStatus" NOT NULL,
    "anakKe" INTEGER,
    "dariBersaudara" INTEGER,
    "tinggalBersama" "TinggalBersama" NOT NULL,
    "bloodType" "BloodType",
    "beratKg" INTEGER,
    "tinggiCm" INTEGER,
    "riwayatPenyakit" TEXT,
    "asalSekolah" TEXT NOT NULL,
    "kewarganegaraan" "Kewarganegaraan" NOT NULL,
    "alamatJalan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "desaKelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "kodePos" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "parentId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,
    "batchId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnail" TEXT,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "published" BOOLEAN NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "PostCategory",

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "category" "CurriculumCategory" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "whatsappGroupLink" TEXT,
    "jalur" "JalurPendaftaran" NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_kodePendaftaran_key" ON "Student"("kodePendaftaran");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nisn_key" ON "Student"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nik_key" ON "Student"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Student_parentId_key" ON "Student"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_fileId_key" ON "Student"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
