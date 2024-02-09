/*
  Warnings:

  - A unique constraint covering the columns `[phaseno]` on the table `RankImport` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RankImport_phaseno_key" ON "RankImport"("phaseno");
