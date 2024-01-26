-- CreateTable
CREATE TABLE "TransactionLog" (
    "id" TEXT NOT NULL,
    "txnid" TEXT NOT NULL,
    "log" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionLog_txnid_key" ON "TransactionLog"("txnid");
