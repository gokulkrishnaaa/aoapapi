/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exam_description_key" ON "Exam"("description");
