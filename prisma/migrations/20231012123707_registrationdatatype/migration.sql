/*
  Warnings:

  - Changed the type of `registrationNo` on the `Registration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "registrationNo",
ADD COLUMN     "registrationNo" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_registrationNo_examId_key" ON "Registration"("registrationNo", "examId");
