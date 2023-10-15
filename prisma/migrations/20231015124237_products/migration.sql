-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_code_key" ON "Products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "Products"("name");
