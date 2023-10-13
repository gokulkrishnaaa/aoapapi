/*
  Warnings:

  - You are about to alter the column `registrationNo` on the `Registration` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Registration" ALTER COLUMN "registrationNo" SET DATA TYPE INTEGER;
