-- CreateTable
CREATE TABLE "JEEApplication" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "jeeId" INTEGER NOT NULL,
    "status" "JEEApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JEEApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JEEApplication_jeeId_candidateId_key" ON "JEEApplication"("jeeId", "candidateId");

-- AddForeignKey
ALTER TABLE "JEEApplication" ADD CONSTRAINT "JEEApplication_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JEEApplication" ADD CONSTRAINT "JEEApplication_jeeId_fkey" FOREIGN KEY ("jeeId") REFERENCES "Jee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
