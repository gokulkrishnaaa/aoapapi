-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "agentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
