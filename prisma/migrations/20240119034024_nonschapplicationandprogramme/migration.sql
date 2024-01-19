-- CreateTable
CREATE TABLE "NonScholarshipApplication" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "nonscholarshipId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "NonScholarshipApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NonScholarshipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonSchApplicationProgrammes" (
    "id" SERIAL NOT NULL,
    "nonscholarshipapplicationId" TEXT NOT NULL,
    "programmesId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NonSchApplicationProgrammes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NonScholarshipApplication_candidateId_key" ON "NonScholarshipApplication"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "NonSchApplicationProgrammes_nonscholarshipapplicationId_pro_key" ON "NonSchApplicationProgrammes"("nonscholarshipapplicationId", "programmesId");

-- AddForeignKey
ALTER TABLE "NonScholarshipApplication" ADD CONSTRAINT "NonScholarshipApplication_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonScholarshipApplication" ADD CONSTRAINT "NonScholarshipApplication_nonscholarshipId_fkey" FOREIGN KEY ("nonscholarshipId") REFERENCES "NonScholarship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonSchApplicationProgrammes" ADD CONSTRAINT "NonSchApplicationProgrammes_nonscholarshipapplicationId_fkey" FOREIGN KEY ("nonscholarshipapplicationId") REFERENCES "NonScholarshipApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonSchApplicationProgrammes" ADD CONSTRAINT "NonSchApplicationProgrammes_programmesId_fkey" FOREIGN KEY ("programmesId") REFERENCES "Programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
