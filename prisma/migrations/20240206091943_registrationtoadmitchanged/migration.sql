/*
  Warnings:

  - A unique constraint covering the columns `[registrationNo,phaseno]` on the table `AdmitCard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AdmitCard_registrationNo_key";

-- AlterTable
ALTER TABLE "AdmitCard" ADD COLUMN     "phaseno" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "AdmitCard_registrationNo_phaseno_key" ON "AdmitCard"("registrationNo", "phaseno");
