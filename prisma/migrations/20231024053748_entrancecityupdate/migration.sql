-- AlterTable
ALTER TABLE "ExamCity" ADD COLUMN     "cityId" INTEGER;

-- AddForeignKey
ALTER TABLE "ExamCity" ADD CONSTRAINT "ExamCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
