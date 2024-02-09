/*
  Warnings:

  - Added the required column `examId` to the `RankImport` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RankImport_phaseno_key";

-- AlterTable
ALTER TABLE "RankImport" ADD COLUMN     "examId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RankImport" ADD CONSTRAINT "RankImport_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
