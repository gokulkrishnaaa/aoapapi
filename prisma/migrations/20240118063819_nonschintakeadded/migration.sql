-- CreateTable
CREATE TABLE "NonScholarship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "NonScholarshipIntakeStatus" NOT NULL DEFAULT 'PAUSE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NonScholarship_pkey" PRIMARY KEY ("id")
);
