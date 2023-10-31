-- CreateTable
CREATE TABLE "Utm" (
    "id" SERIAL NOT NULL,
    "candidateId" TEXT NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utm_candidateId_key" ON "Utm"("candidateId");

-- AddForeignKey
ALTER TABLE "Utm" ADD CONSTRAINT "Utm_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
