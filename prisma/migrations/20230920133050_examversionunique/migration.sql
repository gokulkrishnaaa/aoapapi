/*
  Warnings:

  - A unique constraint covering the columns `[examId,version]` on the table `ExamVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamVersion_examId_version_key" ON "ExamVersion"("examId", "version");
