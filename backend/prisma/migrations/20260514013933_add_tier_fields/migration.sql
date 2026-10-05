-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INBOUND', 'OUTBOUND', 'AJO_CONTRIBUTION');

-- CreateEnum
CREATE TYPE "CircleStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DISSOLVED');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "Trader" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "squadVirtualAccount" TEXT NOT NULL,
    "currentScore" INTEGER NOT NULL DEFAULT 0,
    "activeTier" INTEGER NOT NULL DEFAULT 1,
    "previousTier" INTEGER NOT NULL DEFAULT 1,
    "creditLimit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "outstandingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYCProfile" (
    "id" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "encryptedBvn" TEXT,
    "encryptedNin" TEXT,
    "bvnVerified" BOOLEAN NOT NULL DEFAULT false,
    "ninVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KYCProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "senderAccount" TEXT,
    "squadReference" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreLedger" (
    "id" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "scoreChange" INTEGER NOT NULL,
    "newTotalScore" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AjoCircle" (
    "id" TEXT NOT NULL,
    "potSize" DOUBLE PRECISION NOT NULL,
    "contributionAmount" DOUBLE PRECISION NOT NULL,
    "cycleDuration" INTEGER NOT NULL,
    "status" "CircleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AjoCircle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleMember" (
    "id" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "payoutPosition" INTEGER NOT NULL,
    "lockInEndDate" TIMESTAMP(3) NOT NULL,
    "hasDefaulted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CircleMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "squadEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trader_phoneNumber_key" ON "Trader"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Trader_squadVirtualAccount_key" ON "Trader"("squadVirtualAccount");

-- CreateIndex
CREATE UNIQUE INDEX "KYCProfile_traderId_key" ON "KYCProfile"("traderId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_squadReference_key" ON "Transaction"("squadReference");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_squadEventId_key" ON "WebhookEvent"("squadEventId");

-- AddForeignKey
ALTER TABLE "KYCProfile" ADD CONSTRAINT "KYCProfile_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreLedger" ADD CONSTRAINT "ScoreLedger_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "AjoCircle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
