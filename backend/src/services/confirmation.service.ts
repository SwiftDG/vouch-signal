import { randomBytes } from 'node:crypto';
import { ConfirmationState, PrismaClient, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();
const confirmationLifetimeMs = 7 * 24 * 60 * 60 * 1000;

export async function createConfirmationRequest(supabaseUserId: string, evidenceId: string) {
  return prisma.$transaction(async (transaction) => {
    const evidence = await transaction.evidence.findFirst({
      where: {
        id: evidenceId,
        businessProfile: { supabaseUserId },
      },
      select: {
        id: true,
        confirmationRequest: { select: { id: true, state: true } },
      },
    });

    if (!evidence) return { kind: 'not-found' as const };
    if (evidence.confirmationRequest?.state === ConfirmationState.CONFIRMED) {
      return { kind: 'already-confirmed' as const };
    }

    const now = new Date();
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(now.getTime() + confirmationLifetimeMs);
    const request = evidence.confirmationRequest
      ? await transaction.confirmationRequest.update({
          where: { id: evidence.confirmationRequest.id },
          data: {
            token,
            state: ConfirmationState.PENDING,
            expiresAt,
            confirmerName: null,
            confirmedAt: null,
            declinedAt: null,
          },
          select: { token: true, expiresAt: true },
        })
      : await transaction.confirmationRequest.create({
          data: { evidenceId: evidence.id, token, expiresAt },
          select: { token: true, expiresAt: true },
        });

    return { kind: 'created' as const, request };
  });
}

export async function readConfirmationRequest(token: string) {
  const request = await prisma.confirmationRequest.findUnique({
    where: { token },
    select: {
      id: true,
      state: true,
      expiresAt: true,
      evidence: {
        select: {
          title: true,
          completedDate: true,
          businessProfile: { select: { businessName: true } },
        },
      },
    },
  });

  if (!request) return { kind: 'not-found' as const };

  const now = new Date();
  if (request.state === ConfirmationState.EXPIRED || request.expiresAt <= now) {
    if (request.state === ConfirmationState.PENDING) {
      await prisma.confirmationRequest.updateMany({
        where: { id: request.id, state: ConfirmationState.PENDING, expiresAt: { lte: now } },
        data: { state: ConfirmationState.EXPIRED },
      });
    }
    return { kind: 'expired' as const };
  }
  if (request.state !== ConfirmationState.PENDING) {
    return { kind: 'already-used' as const, state: request.state };
  }

  const statement = `Did ${request.evidence.businessProfile.businessName} complete "${request.evidence.title}" on ${request.evidence.completedDate.toISOString().slice(0, 10)}?`;
  return {
    kind: 'available' as const,
    state: request.state,
    statement,
    expiresAt: request.expiresAt,
  };
}

export async function respondToConfirmation(token: string, decision: 'confirmed' | 'declined') {
  const now = new Date();
  return prisma.$transaction(async (transaction) => {
    const request = await transaction.confirmationRequest.findUnique({
      where: { token },
      select: { id: true, evidenceId: true, state: true, expiresAt: true },
    });

    if (!request) return { kind: 'not-found' as const };
    if (request.state === ConfirmationState.EXPIRED) return { kind: 'expired' as const };
    if (request.state !== ConfirmationState.PENDING) {
      return { kind: 'already-used' as const, state: request.state };
    }

    if (request.expiresAt <= now) {
      await transaction.confirmationRequest.updateMany({
        where: { id: request.id, state: ConfirmationState.PENDING, expiresAt: { lte: now } },
        data: { state: ConfirmationState.EXPIRED },
      });
      return { kind: 'expired' as const };
    }

    const state = decision === 'confirmed' ? ConfirmationState.CONFIRMED : ConfirmationState.DECLINED;
    const changed = await transaction.confirmationRequest.updateMany({
      where: { id: request.id, state: ConfirmationState.PENDING, expiresAt: { gt: now } },
      data: {
        state,
        confirmedAt: decision === 'confirmed' ? now : null,
        declinedAt: decision === 'declined' ? now : null,
      },
    });
    if (changed.count !== 1) {
      const current = await transaction.confirmationRequest.findUnique({
        where: { id: request.id },
        select: { state: true },
      });
      if (current?.state === ConfirmationState.EXPIRED) return { kind: 'expired' as const };
      return {
        kind: 'already-used' as const,
        state: current?.state ?? request.state,
      };
    }

    if (decision === 'confirmed') {
      await transaction.evidence.update({
        where: { id: request.evidenceId },
        data: { verificationStatus: VerificationStatus.CUSTOMER_CONFIRMED },
      });
    }

    return { kind: 'responded' as const, state, respondedAt: now };
  });
}
