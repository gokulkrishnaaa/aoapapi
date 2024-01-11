/*
  Warnings:

  - You are about to drop the column `courseId` on the `Programmes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Campus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Programmes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branchId,campusId]` on the table `Programmes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Campus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Programmes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Programmes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Programmes" DROP CONSTRAINT "Programmes_courseId_fkey";

-- DropIndex
DROP INDEX "Programmes_courseId_campusId_key";

-- AlterTable
ALTER TABLE "Campus" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Programmes" DROP COLUMN "courseId",
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_name_key" ON "Branch"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_code_key" ON "Branch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Campus_code_key" ON "Campus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Programmes_name_key" ON "Programmes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Programmes_branchId_campusId_key" ON "Programmes"("branchId", "campusId");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programmes" ADD CONSTRAINT "Programmes_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
