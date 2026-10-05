-- Add the terminal declined state without rewriting the original migration.
ALTER TYPE "ConfirmationState" ADD VALUE 'DECLINED' BEFORE 'EXPIRED';

ALTER TABLE "ConfirmationRequest"
ADD COLUMN "declinedAt" TIMESTAMP(3);
