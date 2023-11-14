/*
  Warnings:

  - A unique constraint covering the columns `[examId]` on the table `Jee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Jee_examId_key" ON "Jee"("examId");
