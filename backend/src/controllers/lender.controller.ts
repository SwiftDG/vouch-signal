import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ReputationProfile {
  virtualAccount: string;
  currentScore: number;
  activeTier: number;
  creditLimit: number;
  fraudFlag: boolean;
  accountState: string;
  lastUpdated: string;
}

export async function getTraderScore(req: Request, res: Response): Promise<void> {
  const { virtualAccount } = req.params;

  if (!virtualAccount) {
    res.status(400).json({ data: null, error: 'Virtual account parameter required' });
    return;
  }

  try {
    const trader = await prisma.trader.findUnique({
      where: { squadVirtualAccount: virtualAccount },
      select: {
        currentScore: true,
        activeTier: true,
        creditLimit: true,
        updatedAt: true,
        scoreLedger: {
          select: {
            reason: true,
            timestamp: true,
          },
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    if (!trader) {
      res.status(404).json({ data: null, error: 'Trader not found' });
      return;
    }

    // Check for fraud flag in recent score ledger entries
    const recentEntry = trader.scoreLedger[0];
    const fraudFlag = recentEntry?.reason.toLowerCase().includes('fraud') || false;
    
    // Determine account state
    const accountState = fraudFlag ? 'Flagged' : 'Active';

    const profile: ReputationProfile = {
      virtualAccount,
      currentScore: trader.currentScore,
      activeTier: trader.activeTier || 1,
      creditLimit: trader.creditLimit || 0,
      fraudFlag,
      accountState,
      lastUpdated: trader.updatedAt.toISOString(),
    };

    res.status(200).json({ data: profile, error: null });
  } catch (error) {
    console.error('[lender-api] Error fetching trader score:', error);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
}