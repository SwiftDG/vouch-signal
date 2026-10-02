-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('VENDOR', 'FREELANCER');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('ORDER', 'PROJECT', 'DELIVERY', 'SERVICE', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('SELF_REPORTED', 'CUSTOMER_CONFIRMED');

-- CreateEnum
CREATE TYPE "ConfirmationState" AS ENUM ('PENDING', 'CONFIRMED', 'EXPIRED');

-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" TEXT NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "publicSlug" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "category" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "contactUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "ConfirmationRequest" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "state" "ConfirmationState" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "confirmerName" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfirmationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_supabaseUserId_key" ON "BusinessProfile"("supabaseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_publicSlug_key" ON "BusinessProfile"("publicSlug");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationRequest_evidenceId_key" ON "ConfirmationRequest"("evidenceId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationRequest_token_key" ON "ConfirmationRequest"("token");

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_businessProfileId_fkey" FOREIGN KEY ("businessProfileId") REFERENCES "BusinessProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationRequest" ADD CONSTRAINT "ConfirmationRequest_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

