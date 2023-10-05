-- CreateTable
CREATE TABLE "ParentInfo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullname" TEXT,
    "candidateId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "phonecode" TEXT,
    "emailverified" TIMESTAMP(3),
    "phoneverified" TIMESTAMP(3),

    CONSTRAINT "ParentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlusTwoInfo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "candidateId" TEXT NOT NULL,
    "stateId" INTEGER,

    CONSTRAINT "PlusTwoInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParentInfo_candidateId_key" ON "ParentInfo"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentInfo_email_key" ON "ParentInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ParentInfo_phone_key" ON "ParentInfo"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PlusTwoInfo_candidateId_key" ON "PlusTwoInfo"("candidateId");

-- AddForeignKey
ALTER TABLE "ParentInfo" ADD CONSTRAINT "ParentInfo_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlusTwoInfo" ADD CONSTRAINT "PlusTwoInfo_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlusTwoInfo" ADD CONSTRAINT "PlusTwoInfo_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;
