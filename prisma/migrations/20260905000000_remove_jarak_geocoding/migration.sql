/*
  Warnings:

  - You are about to drop the column `jarakRumahSekolah` on the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `alamatLengkap` on the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "jarakRumahSekolah",
DROP COLUMN "alamatLengkap";