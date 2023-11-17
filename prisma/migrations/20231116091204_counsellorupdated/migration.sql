/*
  Warnings:

  - Added the required column `updatedAt` to the `Counsellor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Counsellor_name_key";

-- AlterTable
ALTER TABLE "Counsellor" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
