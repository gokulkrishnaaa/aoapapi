/*
  Warnings:

  - A unique constraint covering the columns `[examId,candidateId]` on the table `ExamApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamApplication_examId_candidateId_key" ON "ExamApplication"("examId", "candidateId");
