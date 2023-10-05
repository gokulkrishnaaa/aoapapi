-- CreateTable
CREATE TABLE "ApplicationCities" (
    "id" SERIAL NOT NULL,
    "examapplicationId" TEXT NOT NULL,
    "examcityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationCities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCities_examapplicationId_key" ON "ApplicationCities"("examapplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCities_examapplicationId_examcityId_key" ON "ApplicationCities"("examapplicationId", "examcityId");

-- AddForeignKey
ALTER TABLE "ApplicationCities" ADD CONSTRAINT "ApplicationCities_examapplicationId_fkey" FOREIGN KEY ("examapplicationId") REFERENCES "ExamApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCities" ADD CONSTRAINT "ApplicationCities_examcityId_fkey" FOREIGN KEY ("examcityId") REFERENCES "ExamCity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
