-- CreateTable
CREATE TABLE "NumberOtp" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NumberOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NumberOtp_code_key" ON "NumberOtp"("code");
