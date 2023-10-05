/*
  Warnings:

  - You are about to drop the column `version` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `examversionId` on the `ExamApplication` table. All the data in the column will be lost.
  - You are about to drop the column `examversionId` on the `Registration` table. All the data in the column will be lost.
  - Added the required column `examId` to the `ExamApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examId` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExamApplication" DROP CONSTRAINT "ExamApplication_examversionId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_examversionId_fkey";

-- DropIndex
DROP INDEX "Exam_entranceId_version_key";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "version",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "ExamApplication" DROP COLUMN "examversionId",
ADD COLUMN     "examId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "examversionId",
ADD COLUMN     "examId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamApplication" ADD CONSTRAINT "ExamApplication_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
