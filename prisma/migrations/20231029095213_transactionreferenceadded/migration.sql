/*
  Warnings:

  - Added the required column `reference` to the `EntrancePayments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EntrancePayments" ADD COLUMN     "reference" TEXT NOT NULL;
