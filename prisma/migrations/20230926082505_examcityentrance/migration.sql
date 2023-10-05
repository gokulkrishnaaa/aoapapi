/*
  Warnings:

  - Added the required column `entranceId` to the `ExamCity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExamCity" DROP CONSTRAINT "ExamCity_examId_fkey";

-- AlterTable
ALTER TABLE "ExamCity" ADD COLUMN     "entranceId" TEXT NOT NULL,
ALTER COLUMN "examId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamCity" ADD CONSTRAINT "ExamCity_entranceId_fkey" FOREIGN KEY ("entranceId") REFERENCES "Entrance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamCity" ADD CONSTRAINT "ExamCity_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
