-- CreateTable
CREATE TABLE "RankImport" (
    "id" SERIAL NOT NULL,
    "phaseno" INTEGER NOT NULL,
    "status" "RankImportStatus" NOT NULL DEFAULT 'STARTED',

    CONSTRAINT "RankImport_pkey" PRIMARY KEY ("id")
);
