/*
  Warnings:

  - You are about to drop the column `examId` on the `Jee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Jee" DROP CONSTRAINT "Jee_examId_fkey";

-- DropIndex
DROP INDEX "Jee_examId_key";

-- AlterTable
ALTER TABLE "Jee" DROP COLUMN "examId";
