-- CreateTable
CREATE TABLE "ApplicationJEE" (
    "id" SERIAL NOT NULL,
    "examapplicationId" TEXT NOT NULL,
    "jee" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationJEE_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationJEE_examapplicationId_key" ON "ApplicationJEE"("examapplicationId");

-- AddForeignKey
ALTER TABLE "ApplicationJEE" ADD CONSTRAINT "ApplicationJEE_examapplicationId_fkey" FOREIGN KEY ("examapplicationId") REFERENCES "ExamApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
