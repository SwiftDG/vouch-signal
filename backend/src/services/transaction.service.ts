import { PrismaClient, TransactionType } from '@prisma/client';
import { VouchEngine, UserData } from '../engine/vouch.engine';
import { detectCircularFraud, applyFraudPenalty } from '../engine/fraud.detector';

const prisma = new PrismaClient();
const engine = new VouchEngine();

interface ChargeCompletedPayload {
  transaction_ref: string;
  amount: number;
  merchant_id?: string;
  [key: string]: unknown;
}

export function isChargeCompleted(payload: Record<string, unknown>): payload is ChargeCompletedPayload {
  return (
    typeof payload['transaction_ref'] === 'string' &&
    typeof payload['amount'] === 'number'
  );
}

async function buildUserData(traderId: string): Promise<UserData> {
  const trader = await prisma.trader.findUnique({ where: { id: traderId } });
  if (!trader) throw new Error('Trader not found');

  const firstTx = await prisma.transaction.findFirst({
    where: { traderId },
    orderBy: { timestamp: 'asc' }
  });

  const monthsActive = firstTx
    ? Math.max(1, Math.floor((Date.now() - firstTx.timestamp.getTime()) / (30 * 24 * 60 * 60 * 1000)))
    : 1;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentTxs = await prisma.transaction.findMany({
    where: { traderId, timestamp: { gte: thirtyDaysAgo } }
  });

  const uniqueTxThisMonth = new Set(recentTxs.map(tx => tx.squadReference)).size;
  const actual30DayVolume = recentTxs.reduce((sum, tx) => sum + tx.amount, 0);

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const recentDays = recentTxs.filter(tx => tx.timestamp >= threeDaysAgo);
  const dayBuckets = new Set<string>();
  for (const tx of recentDays) {
    const day = tx.timestamp.toISOString().split('T')[0];
    dayBuckets.add(day);
  }
  const dailyConsistencyPoints = dayBuckets.size * 4;

  const senderCounts = new Map<string, number>();
  for (const tx of recentTxs) {
    if (tx.senderAccount) {
      senderCounts.set(tx.senderAccount, (senderCounts.get(tx.senderAccount) || 0) + 1);
    }
  }
  const repeatSenders = Array.from(senderCounts.values()).filter(count => count > 1).length;
  const newSenders = Array.from(senderCounts.values()).filter(count => count === 1).length;

  return {
    months_active: monthsActive,
    unique_tx_this_month: uniqueTxThisMonth,
    daily_consistency_points: dailyConsistencyPoints,
    repeat_senders_this_month: repeatSenders,
    new_senders_this_month: newSenders,
    actual_30_day_volume: actual30DayVolume,
    outstanding_balance: trader.outstandingBalance || 0,
    previous_tier: trader.activeTier || 1,
    months_in_default: 0
  };
}

export async function processWebhookTransaction(
  squadEventId: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (!isChargeCompleted(payload)) {
    console.error(`[scoring] invalid charge.completed payload for ${squadEventId}`);
    return;
  }

  // amount from Squad is in kobo — convert to naira
  const amount = payload.amount / 100;
  const senderAccount = typeof payload['merchant_id'] === 'string' ? payload['merchant_id'] : null;

  // Find trader by transaction ref prefix (merchant_id) or fall back to first trader for sandbox
  const trader = await prisma.trader.findFirst({
    where: senderAccount ? { squadVirtualAccount: { not: senderAccount } } : {},
    orderBy: { createdAt: 'desc' },
  });

  if (!trader) {
    console.error(`[scoring] no trader found for squadEventId: ${squadEventId}`);
    return;
  }

  if (senderAccount) {
    const isFraud = await detectCircularFraud(senderAccount, trader.id);
    if (isFraud) {
      await applyFraudPenalty(trader.id, trader.currentScore);
      await prisma.webhookEvent.update({
        where: { squadEventId },
        data: { processingStatus: 'PROCESSED' },
      });
      return;
    }
  }

  await prisma.transaction.create({
    data: {
      traderId: trader.id,
      amount,
      senderAccount,
      squadReference: payload.transaction_ref,
      transactionType: TransactionType.INBOUND,
    },
  });

  const userData = await buildUserData(trader.id);
  const profile = engine.calculateFinalProfile(userData);

  const scoreDelta = profile.Final_Score - trader.currentScore;
  const reason = `Vouch Engine: Score ${trader.currentScore} → ${profile.Final_Score} | Tier ${profile.Current_Tier} | Limit ₦${profile.Credit_Limit.toLocaleString()} | ${profile.Account_State} | Breakdown: A=${profile.Metrics_Breakdown.Var_A_Age}, B=${profile.Metrics_Breakdown.Var_B_Consistency}, C=${profile.Metrics_Breakdown.Var_C_Network}, D=${profile.Metrics_Breakdown.Var_D_Volume}`;

  await prisma.$transaction([
    prisma.trader.update({
      where: { id: trader.id },
      data: {
        currentScore: profile.Final_Score,
        activeTier: profile.Current_Tier,
        creditLimit: profile.Credit_Limit
      },
    }),
    prisma.scoreLedger.create({
      data: {
        traderId: trader.id,
        scoreChange: scoreDelta,
        newTotalScore: profile.Final_Score,
        reason,
      },
    }),
    prisma.webhookEvent.update({
      where: { squadEventId },
      data: { processingStatus: 'PROCESSED' },
    }),
  ]);

  console.log(`[scoring] ${reason}`);
}
