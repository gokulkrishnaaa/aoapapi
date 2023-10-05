-- CreateTable
CREATE TABLE "ExamApplicationProgress" (
    "examapplicationId" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamApplicationProgress_examapplicationId_key" ON "ExamApplicationProgress"("examapplicationId");

-- AddForeignKey
ALTER TABLE "ExamApplicationProgress" ADD CONSTRAINT "ExamApplicationProgress_examapplicationId_fkey" FOREIGN KEY ("examapplicationId") REFERENCES "ExamApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
