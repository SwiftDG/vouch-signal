import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/crypto.util';
import { createVirtualAccount } from '../services/squad.service';

const prisma = new PrismaClient();

interface OnboardPayload {
  phoneNumber: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  bvn: string;
  dob: string;
  address: string;
  gender: string;
  beneficiaryAccount: string;
}

function isOnboardPayload(body: unknown): body is OnboardPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b['phoneNumber'] === 'string' &&
    typeof b['businessName'] === 'string' &&
    typeof b['firstName'] === 'string' &&
    typeof b['lastName'] === 'string' &&
    typeof b['email'] === 'string' &&
    typeof b['bvn'] === 'string' &&
    typeof b['dob'] === 'string' &&
    typeof b['address'] === 'string' &&
    typeof b['gender'] === 'string' &&
    typeof b['beneficiaryAccount'] === 'string'
  );
}

export async function onboardTrader(req: Request, res: Response): Promise<void> {
  if (!isOnboardPayload(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  // Get authenticated user ID from JWT
  const userId = (req as any).user?.id;
  if (!userId) {
    res.status(401).json({ data: null, error: 'User not authenticated' });
    return;
  }

  // Check if user already has a trader profile
  const existingTrader = await prisma.trader.findUnique({
    where: { supabaseUserId: userId }
  });

  if (existingTrader) {
    res.status(400).json({ 
      data: null, 
      error: 'You have already onboarded. Each user can only have one trader profile.' 
    });
    return;
  }

  const { phoneNumber, businessName, firstName, lastName, email, bvn, dob, address, gender, beneficiaryAccount } = req.body;

  const encryptedBvn = encrypt(bvn);

  const virtualAccountData = await createVirtualAccount({
    customer_identifier: phoneNumber,
    first_name: firstName,
    last_name: lastName,
    mobile_num: phoneNumber,
    email,
    bvn,
    dob,
    address,
    gender,
    beneficiary_account: beneficiaryAccount,
  });

  const trader = await prisma.trader.create({
    data: {
      supabaseUserId: userId, // Link to Supabase user
      phoneNumber,
      businessName,
      squadVirtualAccount: virtualAccountData.virtual_account_number,
      kycProfile: {
        create: { encryptedBvn },
      },
    },
  });

  console.log(`[onboarding] Trader created for user ${userId}: ${trader.id}`);

  res.status(201).json({
    data: {
      traderId: trader.id,
      virtualAccount: trader.squadVirtualAccount,
    },
    error: null,
  });
}

// GET /api/v1/traders/score - Returns current score, tier, credit limit, and outstanding balance
export async function getTraderScore(req: Request, res: Response): Promise<void> {
  try {
    // Extract user ID from authenticated user (middleware sets req.user.id)
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ data: null, error: 'User not authenticated' });
      return;
    }

    console.log(`[getTraderScore] Authenticated user ID: ${userId}`);

    // Get ONLY this user's trader profile
    const trader = await prisma.trader.findUnique({
      where: { supabaseUserId: userId },
      select: {
        id: true,
        businessName: true,
        squadVirtualAccount: true,
        currentScore: true,
        activeTier: true,
        creditLimit: true,
        outstandingBalance: true,
        updatedAt: true
      }
    });

    if (!trader) {
      res.status(404).json({ 
        data: null, 
        error: 'You have not onboarded yet. Please complete onboarding first at POST /api/v1/traders/onboard' 
      });
      return;
    }

    console.log(`[getTraderScore] Returning score for trader: ${trader.id}`);

    res.status(200).json({
      data: {
        traderId: trader.id,
        businessName: trader.businessName,
        virtualAccount: trader.squadVirtualAccount,
        currentScore: trader.currentScore,
        activeTier: trader.activeTier,
        creditLimit: trader.creditLimit,
        outstandingBalance: trader.outstandingBalance,
        lastUpdated: trader.updatedAt.toISOString()
      },
      error: null
    });
  } catch (error) {
    console.error('Error fetching trader score:', error);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
}

// GET /api/v1/traders/transactions - Returns 50 most recent transactions
export async function getTraderTransactions(req: Request, res: Response): Promise<void> {
  try {
    // Extract user ID from authenticated user
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ data: null, error: 'User not authenticated' });
      return;
    }

    console.log(`[getTraderTransactions] Authenticated user ID: ${userId}`);

    // Get ONLY this user's trader profile
    const trader = await prisma.trader.findUnique({
      where: { supabaseUserId: userId },
      select: { id: true }
    });

    if (!trader) {
      res.status(404).json({ 
        data: null, 
        error: 'You have not onboarded yet. Please complete onboarding first.' 
      });
      return;
    }

    const transactions = await prisma.transaction.findMany({
      where: { traderId: trader.id },
      orderBy: { timestamp: 'desc' },
      take: 50,
      select: {
        id: true,
        amount: true,
        senderAccount: true,
        squadReference: true,
        transactionType: true,
        timestamp: true
      }
    });

    console.log(`[getTraderTransactions] Returning ${transactions.length} transactions for trader: ${trader.id}`);

    res.status(200).json({
      data: {
        traderId: trader.id,
        transactions: transactions.map(tx => ({
          id: tx.id,
          amount: tx.amount,
          senderAccount: tx.senderAccount,
          squadReference: tx.squadReference,
          transactionType: tx.transactionType,
          timestamp: tx.timestamp.toISOString()
        }))
      },
      error: null
    });
  } catch (error) {
    console.error('Error fetching trader transactions:', error);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
}

// GET /api/v1/traders/score/stream - Server-Sent Events for real-time score updates
export async function streamTraderScore(req: Request, res: Response): Promise<void> {
  try {
    // Extract user ID from authenticated user
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ data: null, error: 'User not authenticated' });
      return;
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Get ONLY this user's trader profile
    const trader = await prisma.trader.findUnique({
      where: { supabaseUserId: userId },
      select: { id: true }
    });

    if (!trader) {
      res.write(`data: ${JSON.stringify({ error: 'You have not onboarded yet' })}\n\n`);
      res.end();
      return;
    }

    // Send initial data
    const sendScoreUpdate = async () => {
      try {
        const currentTrader = await prisma.trader.findUnique({
          where: { id: trader.id },
          select: {
            currentScore: true,
            activeTier: true,
            creditLimit: true,
            outstandingBalance: true,
            updatedAt: true
          }
        });

        if (currentTrader) {
          const data = {
            currentScore: currentTrader.currentScore,
            activeTier: currentTrader.activeTier,
            creditLimit: currentTrader.creditLimit,
            outstandingBalance: currentTrader.outstandingBalance,
            lastUpdated: currentTrader.updatedAt.toISOString(),
            timestamp: new Date().toISOString()
          };

          res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
      } catch (error) {
        console.error('Error in SSE update:', error);
      }
    };

    // Send initial update
    await sendScoreUpdate();

    // Set up 5-second polling interval
    const interval = setInterval(sendScoreUpdate, 5000);

    // Cleanup on client disconnect
    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });

    req.on('end', () => {
      clearInterval(interval);
      res.end();
    });

  } catch (error) {
    console.error('Error setting up SSE:', error);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
}
