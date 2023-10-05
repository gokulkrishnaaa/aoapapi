-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullname" TEXT,
    "dob" TIMESTAMP(3),
    "genderId" INTEGER,
    "socialstatusId" INTEGER,
    "email" TEXT,
    "phone" TEXT,
    "phonecode" TEXT,
    "infosourceId" INTEGER,
    "aadhaarnumber" TEXT,
    "stateId" INTEGER,
    "districtId" INTEGER,
    "cityId" INTEGER,
    "address1" TEXT,
    "address2" TEXT,
    "photoid" TEXT,
    "signid" TEXT,
    "emailverified" TIMESTAMP(3),
    "phoneverified" TIMESTAMP(3),
    "aadhaarverifed" TIMESTAMP(3),

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_socialstatusId_fkey" FOREIGN KEY ("socialstatusId") REFERENCES "SocialStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_infosourceId_fkey" FOREIGN KEY ("infosourceId") REFERENCES "InfoSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
