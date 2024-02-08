-- CreateTable
CREATE TABLE "Reattempt" (
    "id" SERIAL NOT NULL,
    "registrationNo" INTEGER NOT NULL,
    "phaseno" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reattempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reattempt_registrationNo_phaseno_key" ON "Reattempt"("registrationNo", "phaseno");

-- AddForeignKey
ALTER TABLE "Reattempt" ADD CONSTRAINT "Reattempt_registrationNo_fkey" FOREIGN KEY ("registrationNo") REFERENCES "Registration"("registrationNo") ON DELETE RESTRICT ON UPDATE CASCADE;
