ALTER TABLE "Student" ADD COLUMN "testBahasaInggris" INTEGER,
ADD COLUMN "testKarakter" INTEGER,
ADD COLUMN "rataRataSKHU" DOUBLE PRECISION;

ALTER TABLE "Student" ADD CONSTRAINT "Student_rataRataSKHU_check"
CHECK ("rataRataSKHU" IS NULL OR "rataRataSKHU" BETWEEN 0 AND 100);

ALTER TABLE "Student" ADD CONSTRAINT "Student_testBahasaInggris_check"
CHECK ("testBahasaInggris" IS NULL OR "testBahasaInggris" BETWEEN 1 AND 100);

ALTER TABLE "Student" ADD CONSTRAINT "Student_testKarakter_check"
CHECK ("testKarakter" IS NULL OR "testKarakter" BETWEEN 1 AND 100);
