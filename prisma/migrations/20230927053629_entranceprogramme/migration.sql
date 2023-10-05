-- CreateTable
CREATE TABLE "EntranceProgrammes" (
    "id" SERIAL NOT NULL,
    "entranceId" TEXT NOT NULL,
    "programmeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntranceProgrammes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntranceProgrammes_entranceId_programmeId_key" ON "EntranceProgrammes"("entranceId", "programmeId");

-- AddForeignKey
ALTER TABLE "EntranceProgrammes" ADD CONSTRAINT "EntranceProgrammes_entranceId_fkey" FOREIGN KEY ("entranceId") REFERENCES "Entrance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceProgrammes" ADD CONSTRAINT "EntranceProgrammes_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
