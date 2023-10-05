/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exam_code_key" ON "Exam"("code");
