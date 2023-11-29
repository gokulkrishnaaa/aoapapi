/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_phone_key" ON "Agent"("phone");
