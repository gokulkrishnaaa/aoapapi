/*
  Warnings:

  - You are about to drop the column `examId` on the `ExamCity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExamCity" DROP CONSTRAINT "ExamCity_examId_fkey";

-- AlterTable
ALTER TABLE "ExamCity" DROP COLUMN "examId";
