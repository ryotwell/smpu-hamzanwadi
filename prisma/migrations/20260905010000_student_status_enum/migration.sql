-- CreateEnum
CREATE TYPE "StatusPendaftaran" AS ENUM ('DITERIMA', 'DITOLAK', 'MENUNGGU');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN "status" "StatusPendaftaran" NOT NULL DEFAULT 'MENUNGGU';

-- Backfill: isAccepted true -> DITERIMA, false -> MENUNGGU (sudah default)
UPDATE "Student" SET "status" = 'DITERIMA' WHERE "isAccepted";

-- DropColumn
ALTER TABLE "Student" DROP COLUMN "isAccepted";
