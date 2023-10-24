/*
  Warnings:

  - A unique constraint covering the columns `[entranceId,cityId]` on the table `ExamCity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamCity_entranceId_cityId_key" ON "ExamCity"("entranceId", "cityId");
