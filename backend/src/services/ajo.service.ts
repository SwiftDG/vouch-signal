import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AJO_SUCCESS_DELTA = 40;
const AJO_FAILURE_DELTA = -60;

export async function processAjoEvent(
  traderId: string,
  eventType: 'recurring.completed' | 'recurring.failed'
): Promise<void> {
  const trader = await prisma.trader.findUnique({ where: { id: traderId } });

  if (!trader) {
    console.error(`[ajo] no trader found: ${traderId}`);
    return;
  }

  const delta = eventType === 'recurring.completed' ? AJO_SUCCESS_DELTA : AJO_FAILURE_DELTA;
  const newTotalScore = Math.max(0, trader.currentScore + delta);
  const reason =
    eventType === 'recurring.completed'
      ? 'On-time Ajo circle contribution completed'
      : 'Ajo circle contribution failed — payment missed';

  await prisma.$transaction([
    prisma.trader.update({
      where: { id: traderId },
      data: { currentScore: newTotalScore },
    }),
    prisma.scoreLedger.create({
      data: {
        traderId,
        scoreChange: delta,
        newTotalScore,
        reason,
      },
    }),
  ]);

  console.log(`[ajo] trader ${traderId} score: ${trader.currentScore} → ${newTotalScore} (${reason})`);
}
