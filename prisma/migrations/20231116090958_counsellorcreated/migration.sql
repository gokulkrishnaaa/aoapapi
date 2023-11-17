-- CreateTable
CREATE TABLE "Counsellor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Counsellor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Counsellor_name_key" ON "Counsellor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Counsellor_email_key" ON "Counsellor"("email");
