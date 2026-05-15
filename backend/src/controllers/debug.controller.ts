import { Request, Response } from 'express';
import { PrismaClient, TransactionType } from '@prisma/client';
import { VouchEngine } from '../engine/vouch.engine';
import crypto from 'crypto';

const prisma = new PrismaClient();
const engine = new VouchEngine();

export const simulateHistory = async (req: Request, res: Response) => {
    try {
        const { traderId } = req.body;

        if (!traderId) {
            return res.status(400).json({ error: 'traderId is required in payload' });
        }

        console.log(`[Demo Mode] Initiating 30-Day Time Skip for Trader: ${traderId}...`);

        // 1. Clean slate for the video demo (Idempotency)
        await prisma.transaction.deleteMany({ where: { traderId } });
        await prisma.scoreLedger.deleteMany({ where: { traderId } });

        // 2. Generate 30 days of data
        const transactions = [];
        const repeatSenders = ['0123456789', '0987654321', '1122334455'];
        const now = new Date();

        // Loop backwards from 30 days ago to today
        for (let i = 30; i >= 0; i--) {
            const txDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));

            // Generate 3 transactions per day to hit Consistency Caps (Var B)
            for (let j = 0; j < 3; j++) {
                // Mix of repeat senders and brand new random senders (Var C)
                const senderAccount = j === 0 
                    ? repeatSenders[Math.floor(Math.random() * repeatSenders.length)] 
                    : Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');

                transactions.push({
                    traderId,
                    amount: 2500, // 90 tx * 2500 NGN = 225,000 NGN (Easily clears Tier 3 Target Volume)
                    senderAccount,
                    squadReference: `SIM_SQ_${crypto.randomBytes(8).toString('hex')}`,
                    transactionType: TransactionType.INBOUND,
                    timestamp: txDate,
                });
            }
        }

        // Bulk insert the simulated history
        await prisma.transaction.createMany({ data: transactions });

        // 3. Mock the Aggregation (The DB Job) for the Engine
        // (Since we perfectly crafted the math above, we know exactly what to pass the engine)
        const userData = {
            months_active: 1, // Simulated 1 month
            unique_tx_this_month: 90,
            daily_consistency_points: 270, // 30 days * 3 senders * 3 pts
            repeat_senders_this_month: 30,
            new_senders_this_month: 60,
            actual_30_day_volume: 225000,
            outstanding_balance: 0,
            previous_tier: 1,
            months_in_default: 0
        };

        // 4. Run the Engine!
        const profile = engine.calculateFinalProfile(userData);

        // 5. Update Trader state to match the new organic score
        const updatedTrader = await prisma.trader.update({
            where: { id: traderId },
            data: {
                currentScore: profile.Final_Score,
                activeTier: profile.Current_Tier,
                previousTier: 1,
                creditLimit: profile.Credit_Limit,
            }
        });

        // 6. Log it in the ledger so the dashboard has an audit trail
        await prisma.scoreLedger.create({
            data: {
                traderId,
                scoreChange: profile.Final_Score,
                newTotalScore: profile.Final_Score,
                reason: "Unit 08 Demo Simulation: Fast-forwarded 30 days of organic Squad trading history."
            }
        });

        console.log(`[Demo Mode] Success! Trader elevated to Tier ${profile.Current_Tier} with Score ${profile.Final_Score}`);

        return res.status(200).json({
            message: "Time skip successful. 30 days of data injected.",
            injectedTransactions: transactions.length,
            newProfile: profile,
            trader: updatedTrader
        });

    } catch (error) {
        console.error("Simulation error:", error);
        return res.status(500).json({ error: "Failed to run simulation" });
    }
};

// Keep existing simulatePayments function for backward compatibility
export const simulatePayments = async (req: Request, res: Response): Promise<void> => {
  try {
    // Environment check - restrict to development/demo only
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        data: null,
        error: 'Simulation endpoints are disabled in production'
      });
      return;
    }

    const { traderId, count } = req.body;

    if (!traderId || !count || count <= 0) {
      res.status(400).json({
        data: null,
        error: 'Invalid request payload. Required: traderId, count (> 0)'
      });
      return;
    }

    console.log(`🎯 DEBUG: Use /simulate-history for demo purposes`);

    res.status(200).json({
      data: {
        message: "Use /simulate-history for demo purposes",
        traderId,
        count
      },
      error: null
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      data: null,
      error: 'Internal server error during debug processing'
    });
  }
};