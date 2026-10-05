-- CreateEnum
CREATE TYPE "ConfirmationState" AS ENUM ('PENDING', 'CONFIRMED', 'EXPIRED');

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
CREATE UNIQUE INDEX "ConfirmationRequest_evidenceId_key"
    ON "ConfirmationRequest"("evidenceId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationRequest_token_key"
    ON "ConfirmationRequest"("token");

-- AddForeignKey
ALTER TABLE "ConfirmationRequest"
ADD CONSTRAINT "ConfirmationRequest_evidenceId_fkey"
FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
