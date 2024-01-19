/*
  Warnings:

  - A unique constraint covering the columns `[candidateId,nonscholarshipId]` on the table `NonScholarshipApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NonScholarshipApplication_candidateId_nonscholarshipId_key" ON "NonScholarshipApplication"("candidateId", "nonscholarshipId");
