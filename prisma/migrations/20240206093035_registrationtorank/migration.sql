-- AlterTable
ALTER TABLE "AdmitCard" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Rank" (
    "id" SERIAL NOT NULL,
    "registrationNo" INTEGER NOT NULL,
    "phaseno" INTEGER NOT NULL DEFAULT 1,
    "percentile" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rank_registrationNo_phaseno_key" ON "Rank"("registrationNo", "phaseno");

-- AddForeignKey
ALTER TABLE "Rank" ADD CONSTRAINT "Rank_registrationNo_fkey" FOREIGN KEY ("registrationNo") REFERENCES "Registration"("registrationNo") ON DELETE RESTRICT ON UPDATE CASCADE;
