-- CreateTable
CREATE TABLE "JEEPayments" (
    "id" TEXT NOT NULL,
    "txnid" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "jeeapplicationId" TEXT NOT NULL,
    "description" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'STARTED',
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JEEPayments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JEEPayments_txnid_key" ON "JEEPayments"("txnid");

-- AddForeignKey
ALTER TABLE "JEEPayments" ADD CONSTRAINT "JEEPayments_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JEEPayments" ADD CONSTRAINT "JEEPayments_jeeapplicationId_fkey" FOREIGN KEY ("jeeapplicationId") REFERENCES "JEEApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
