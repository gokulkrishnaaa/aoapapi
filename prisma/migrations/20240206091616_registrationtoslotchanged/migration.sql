/*
  Warnings:

  - A unique constraint covering the columns `[registrationNo,phaseno]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Slot_registrationNo_key";

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "phaseno" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Slot_registrationNo_phaseno_key" ON "Slot"("registrationNo", "phaseno");
