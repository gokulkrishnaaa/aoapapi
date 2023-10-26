/*
  Warnings:

  - You are about to drop the column `name` on the `ExamCity` table. All the data in the column will be lost.
  - Made the column `cityId` on table `ExamCity` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExamCity" DROP CONSTRAINT "ExamCity_cityId_fkey";

-- AlterTable
ALTER TABLE "ExamCity" DROP COLUMN "name",
ALTER COLUMN "cityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamCity" ADD CONSTRAINT "ExamCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
