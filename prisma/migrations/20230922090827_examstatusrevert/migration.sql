/*
  Warnings:

  - The values [PAYMENT] on the enum `ExamApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExamApplicationStatus_new" AS ENUM ('PENDING', 'REGISTERED', 'SLOT', 'ADMIT', 'RANK');
ALTER TABLE "ExamApplication" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ExamApplication" ALTER COLUMN "status" TYPE "ExamApplicationStatus_new" USING ("status"::text::"ExamApplicationStatus_new");
ALTER TYPE "ExamApplicationStatus" RENAME TO "ExamApplicationStatus_old";
ALTER TYPE "ExamApplicationStatus_new" RENAME TO "ExamApplicationStatus";
DROP TYPE "ExamApplicationStatus_old";
ALTER TABLE "ExamApplication" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
