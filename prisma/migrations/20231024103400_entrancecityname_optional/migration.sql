-- DropIndex
DROP INDEX "ExamCity_name_key";

-- AlterTable
ALTER TABLE "ExamCity" ALTER COLUMN "name" DROP NOT NULL;
