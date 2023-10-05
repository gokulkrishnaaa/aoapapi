/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Entrance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entrance_description_key" ON "Entrance"("description");
