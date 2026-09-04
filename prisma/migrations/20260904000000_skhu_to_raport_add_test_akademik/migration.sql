/* Ganti rataRataSKHU -> rataRataRaport (data lama tetap dipertahankan) */
ALTER TABLE "Student" RENAME COLUMN "rataRataSKHU" TO "rataRataRaport";

ALTER TABLE "Student" RENAME CONSTRAINT "Student_rataRataSKHU_check" TO "Student_rataRataRaport_check";

/* Tambah tes akademik */
ALTER TABLE "Student" ADD COLUMN "testAkademik" INTEGER;

ALTER TABLE "Student" ADD CONSTRAINT "Student_testAkademik_check"
CHECK ("testAkademik" IS NULL OR "testAkademik" BETWEEN 1 AND 100);