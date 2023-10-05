/*
  Warnings:

  - You are about to drop the column `aadhaarverifed` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "aadhaarverifed",
ADD COLUMN     "aadhaarverified" TIMESTAMP(3);
