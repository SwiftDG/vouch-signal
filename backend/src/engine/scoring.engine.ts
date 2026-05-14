import { Transaction } from '@prisma/client';

interface ScoreResult {
  delta: number;
  reason: string;
}

/**
 * Weighted-Logistic scoring algorithm.
 * Evaluates volume, consistency, and sender diversity from transaction history.
 */
export function calculateScoreDelta(
  incomingTx: Transaction,
  recentHistory: Transaction[]
): ScoreResult {
  let delta = 0;
  const reasons: string[] = [];

  // --- Volume metric (weight: 40%) ---
  // Base points per inbound payment, scaled by amount
  const volumePoints = Math.min(Math.floor(incomingTx.amount / 1000) * 2 + 5, 20);
  delta += volumePoints;
  reasons.push(`Volume +${volumePoints}`);

  // --- Consistency metric (weight: 35%) ---
  // Reward if trader has received payments in each of the last 3 days
  const now = new Date();
  const dayBuckets = new Set<string>();
  for (const tx of recentHistory) {
    const daysAgo = Math.floor(
      (now.getTime() - new Date(tx.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysAgo <= 3) dayBuckets.add(String(daysAgo));
  }
  const consistencyPoints = dayBuckets.size >= 3 ? 15 : dayBuckets.size * 4;
  delta += consistencyPoints;
  reasons.push(`Consistency +${consistencyPoints}`);

  // --- Diversity metric (weight: 25%) ---
  // Reward unique sender accounts (more unique customers = healthier business)
  const uniqueSenders = new Set(
    recentHistory
      .filter((tx) => tx.senderAccount !== null)
      .map((tx) => tx.senderAccount)
  );
  if (incomingTx.senderAccount) uniqueSenders.add(incomingTx.senderAccount);
  const diversityPoints = Math.min(uniqueSenders.size * 2, 10);
  delta += diversityPoints;
  reasons.push(`Diversity +${diversityPoints}`);

  return {
    delta,
    reason: `Inbound payment processed. ${reasons.join(', ')}`,
  };
}
