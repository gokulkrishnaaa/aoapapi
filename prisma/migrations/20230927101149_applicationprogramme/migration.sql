-- CreateTable
CREATE TABLE "ApplicationProgrammes" (
    "id" SERIAL NOT NULL,
    "examapplicationId" TEXT NOT NULL,
    "programmeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationProgrammes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationProgrammes_examapplicationId_programmeId_key" ON "ApplicationProgrammes"("examapplicationId", "programmeId");

-- AddForeignKey
ALTER TABLE "ApplicationProgrammes" ADD CONSTRAINT "ApplicationProgrammes_examapplicationId_fkey" FOREIGN KEY ("examapplicationId") REFERENCES "ExamApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationProgrammes" ADD CONSTRAINT "ApplicationProgrammes_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
