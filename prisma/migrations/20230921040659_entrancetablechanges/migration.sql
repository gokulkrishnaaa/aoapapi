/*
  Warnings:

  - You are about to drop the column `code` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the `ExamVersion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[entranceId,version]` on the table `Exam` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entranceId` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExamApplication" DROP CONSTRAINT "ExamApplication_examversionId_fkey";

-- DropForeignKey
ALTER TABLE "ExamVersion" DROP CONSTRAINT "ExamVersion_examId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_examversionId_fkey";

-- DropIndex
DROP INDEX "Exam_code_key";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "code",
DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "entranceId" TEXT NOT NULL,
ADD COLUMN     "status" "ExamStatus" NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ExamVersion";

-- CreateTable
CREATE TABLE "Entrance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Entrance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entrance_code_key" ON "Entrance"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_entranceId_version_key" ON "Exam"("entranceId", "version");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_entranceId_fkey" FOREIGN KEY ("entranceId") REFERENCES "Entrance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamApplication" ADD CONSTRAINT "ExamApplication_examversionId_fkey" FOREIGN KEY ("examversionId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_examversionId_fkey" FOREIGN KEY ("examversionId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
