/*
  Warnings:

  - You are about to drop the column `phaseno` on the `Reattempt` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationNo]` on the table `Reattempt` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reattempt_registrationNo_phaseno_key";

-- AlterTable
ALTER TABLE "Reattempt" DROP COLUMN "phaseno";

-- CreateIndex
CREATE UNIQUE INDEX "Reattempt_registrationNo_key" ON "Reattempt"("registrationNo");
