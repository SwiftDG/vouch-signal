import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CycleRow {
  cycle_detected: boolean;
}

/**
 * Traces senderAccount histories up to 4 hops deep within a 24-hour window.
 * Returns true if money has cycled back to the origin account (circular fraud).
 */
export async function detectCircularFraud(
  originAccount: string,
  traderId: string
): Promise<boolean> {
  const result = await prisma.$queryRaw<CycleRow[]>`
    WITH RECURSIVE transfer_graph AS (
      -- Base: all transactions sent FROM the origin account in the last 24 hours
      SELECT
        t."senderAccount" AS source,
        tr."squadVirtualAccount" AS destination,
        1 AS depth
      FROM "Transaction" t
      INNER JOIN "Trader" tr ON tr.id = t."traderId"
      WHERE t."senderAccount" = ${originAccount}
        AND t."timestamp" >= NOW() - INTERVAL '24 hours'

      UNION ALL

      -- Recursive: follow the money one hop further
      SELECT
        t2."senderAccount",
        tr2."squadVirtualAccount",
        tg.depth + 1
      FROM "Transaction" t2
      INNER JOIN "Trader" tr2 ON tr2.id = t2."traderId"
      INNER JOIN transfer_graph tg ON tg.destination = t2."senderAccount"
      WHERE tg.depth < 4
        AND t2."timestamp" >= NOW() - INTERVAL '24 hours'
    )
    SELECT EXISTS (
      SELECT 1 FROM transfer_graph
      WHERE destination = ${originAccount}
    ) AS cycle_detected
  `;

  return result[0]?.cycle_detected === true;
}

export async function applyFraudPenalty(
  traderId: string,
  currentScore: number
): Promise<void> {
  const PENALTY = -150;
  const newTotalScore = Math.max(0, currentScore + PENALTY);

  await prisma.$transaction([
    prisma.trader.update({
      where: { id: traderId },
      data: { currentScore: newTotalScore },
    }),
    prisma.scoreLedger.create({
      data: {
        traderId,
        scoreChange: PENALTY,
        newTotalScore,
        reason: 'Circular fraud detected: money cycled back to origin within 24 hours',
      },
    }),
  ]);

  console.log(`[fraud] penalty applied to trader ${traderId}: ${currentScore} → ${newTotalScore}`);
}
