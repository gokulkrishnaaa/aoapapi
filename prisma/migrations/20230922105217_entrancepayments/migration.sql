-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('FAILED', 'SUCCESS');

-- CreateTable
CREATE TABLE "EntrancePayments" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "examapplicationId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "EntrancePayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EntrancePayments" ADD CONSTRAINT "EntrancePayments_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntrancePayments" ADD CONSTRAINT "EntrancePayments_examapplicationId_fkey" FOREIGN KEY ("examapplicationId") REFERENCES "ExamApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
