/*
  Warnings:

  - The primary key for the `Registration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Registration` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[registrationNo,examId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Registration_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_registrationNo_examId_key" ON "Registration"("registrationNo", "examId");
