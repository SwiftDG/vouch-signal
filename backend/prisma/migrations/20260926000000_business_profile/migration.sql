-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('VENDOR', 'FREELANCER');

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

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_supabaseUserId_key"
    ON "BusinessProfile"("supabaseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_publicSlug_key"
    ON "BusinessProfile"("publicSlug");
