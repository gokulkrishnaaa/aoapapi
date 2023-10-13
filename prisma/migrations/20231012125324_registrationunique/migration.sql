/*
  Warnings:

  - A unique constraint covering the columns `[examId,examapplicationId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[examId,registrationNo]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Registration_registrationNo_examId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Registration_examId_examapplicationId_key" ON "Registration"("examId", "examapplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_examId_registrationNo_key" ON "Registration"("examId", "registrationNo");
