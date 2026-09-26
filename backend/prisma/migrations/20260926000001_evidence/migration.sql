-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('ORDER', 'PROJECT', 'DELIVERY', 'SERVICE', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('SELF_REPORTED', 'CUSTOMER_CONFIRMED');

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "businessProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "evidenceType" "EvidenceType" NOT NULL,
    "completedDate" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'SELF_REPORTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evidence"
ADD CONSTRAINT "Evidence_businessProfileId_fkey"
FOREIGN KEY ("businessProfileId") REFERENCES "BusinessProfile"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
