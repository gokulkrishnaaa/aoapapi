/*
  Warnings:

  - Added the required column `reference` to the `ExamApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamApplication" ADD COLUMN     "reference" TEXT NOT NULL;
