-- CreateTable
CREATE TABLE "Jee" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jee_description_key" ON "Jee"("description");

-- AddForeignKey
ALTER TABLE "Jee" ADD CONSTRAINT "Jee_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
