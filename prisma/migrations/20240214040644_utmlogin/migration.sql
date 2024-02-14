-- CreateTable
CREATE TABLE "Utmlogin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utmlogin_pkey" PRIMARY KEY ("id")
);
