-- CreateTable
CREATE TABLE "ExamCity" (
    "id" SERIAL NOT NULL,
    "examId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamCity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamCity_name_key" ON "ExamCity"("name");

-- AddForeignKey
ALTER TABLE "ExamCity" ADD CONSTRAINT "ExamCity_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
