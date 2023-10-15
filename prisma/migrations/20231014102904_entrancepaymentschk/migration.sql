/*
  Warnings:

  - A unique constraint covering the columns `[txnid]` on the table `EntrancePayments` will be added. If there are existing duplicate values, this will fail.
  - The required column `txnid` was added to the `EntrancePayments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'STARTED';

-- AlterTable
ALTER TABLE "EntrancePayments" ADD COLUMN     "txnid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EntrancePayments_txnid_key" ON "EntrancePayments"("txnid");
