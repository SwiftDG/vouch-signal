import { PrismaClient, TransactionType } from '@prisma/client';
import { calculateScoreDelta } from '../engine/scoring.engine';
import { detectCircularFraud, applyFraudPenalty } from '../engine/fraud.detector';

const prisma = new PrismaClient();

interface ChargeCompletedPayload {
  TransactionRef: string;
  amount: number;
  sender_account?: string;
  merchant_id?: string;
  [key: string]: unknown;
}

export function isChargeCompleted(payload: Record<string, unknown>): payload is ChargeCompletedPayload {
  return (
    typeof payload['TransactionRef'] === 'string' &&
    typeof payload['amount'] === 'number'
  );
}

export async function processWebhookTransaction(
  squadEventId: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (!isChargeCompleted(payload)) {
    console.error(`[scoring] invalid charge.completed payload for ${squadEventId}`);
    return;
  }

  // Resolve trader by virtual account (merchant_id maps to squadVirtualAccount)
  const trader = await prisma.trader.findUnique({
    where: { squadVirtualAccount: String(payload['merchant_id'] ?? '') },
  });

  if (!trader) {
    console.error(`[scoring] no trader found for merchant_id: ${payload['merchant_id']}`);
    return;
  }

  // Fetch recent transaction history for scoring context (last 30 days)
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentHistory = await prisma.transaction.findMany({
    where: { traderId: trader.id, timestamp: { gte: since } },
  });

  // Build the incoming transaction object for the engine (not yet persisted)
  const incomingTx = {
    id: '',
    traderId: trader.id,
    amount: payload.amount,
    senderAccount: typeof payload['sender_account'] === 'string' ? payload['sender_account'] : null,
    squadReference: payload.TransactionRef,
    transactionType: TransactionType.INBOUND,
    timestamp: new Date(),
  };

  const { delta, reason } = calculateScoreDelta(incomingTx, recentHistory);
  const newTotalScore = trader.currentScore + delta;

  // Fraud check — run CTE cycle detection before committing score
  if (incomingTx.senderAccount) {
    const isFraud = await detectCircularFraud(incomingTx.senderAccount, trader.id);
    if (isFraud) {
      await applyFraudPenalty(trader.id, trader.currentScore);
      await prisma.webhookEvent.update({
        where: { squadEventId },
        data: { processingStatus: 'PROCESSED' },
      });
      return;
    }
  }

  // Atomic commit: save Transaction + update Trader score + append ScoreLedger
  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        traderId: trader.id,
        amount: payload.amount,
        senderAccount: incomingTx.senderAccount,
        squadReference: payload.TransactionRef,
        transactionType: TransactionType.INBOUND,
      },
    }),
    prisma.trader.update({
      where: { id: trader.id },
      data: { currentScore: newTotalScore },
    }),
    prisma.scoreLedger.create({
      data: {
        traderId: trader.id,
        scoreChange: delta,
        newTotalScore,
        reason,
      },
    }),
    prisma.webhookEvent.update({
      where: { squadEventId },
      data: { processingStatus: 'PROCESSED' },
    }),
  ]);

  console.log(`[scoring] trader ${trader.id} score: ${trader.currentScore} → ${newTotalScore} (${reason})`);
}
