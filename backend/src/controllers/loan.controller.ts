import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { disburseLoan } from '../services/squad.service';

const prisma = new PrismaClient();

interface LoanAcceptPayload {
  amount: number;
}

function isLoanAcceptPayload(body: unknown): body is LoanAcceptPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return typeof b['amount'] === 'number' && b['amount'] > 0;
}

// POST /api/v1/loans/accept - Verify credit limit and disburse loan
export async function acceptLoan(req: Request, res: Response): Promise<void> {
  try {
    if (!isLoanAcceptPayload(req.body)) {
      res.status(400).json({ 
        data: null, 
        error: 'Invalid request payload. Required: amount (number > 0)' 
      });
      return;
    }

    // Extract user ID from authenticated user
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ data: null, error: 'User not authenticated' });
      return;
    }

    const { amount } = req.body;

    // Get ONLY this user's trader profile
    const trader = await prisma.trader.findUnique({
      where: { supabaseUserId: userId },
      select: {
        id: true,
        businessName: true,
        squadVirtualAccount: true,
        creditLimit: true,
        outstandingBalance: true,
        currentScore: true,
        activeTier: true
      }
    });

    if (!trader) {
      res.status(404).json({ 
        data: null, 
        error: 'You have not onboarded yet. Please complete onboarding first.' 
      });
      return;
    }

    // Calculate available credit
    const availableCredit = trader.creditLimit - (trader.outstandingBalance || 0);

    // Verify requested amount against available credit
    if (amount > availableCredit) {
      res.status(400).json({
        data: null,
        error: `Loan amount ₦${amount.toLocaleString()} exceeds available credit limit of ₦${availableCredit.toLocaleString()}`
      });
      return;
    }

    // Minimum loan amount check
    if (amount < 1000) {
      res.status(400).json({
        data: null,
        error: 'Minimum loan amount is ₦1,000'
      });
      return;
    }

    try {
      // Generate unique transaction reference
      const transactionRef = `LOAN_${Date.now()}_${trader.id.slice(-8)}`;

      // Trigger Squad Transfer API to disburse funds
      await disburseLoan(
        amount,
        trader.squadVirtualAccount,
        trader.businessName,
        transactionRef
      );

      // Update outstanding balance in database
      const updatedTrader = await prisma.trader.update({
        where: { id: trader.id },
        data: { 
          outstandingBalance: (trader.outstandingBalance || 0) + amount 
        }
      });

      // Log the loan disbursement in score ledger
      await prisma.scoreLedger.create({
        data: {
          traderId: trader.id,
          scoreChange: 0, // No score change for loan acceptance
          newTotalScore: trader.currentScore,
          reason: `Loan Accepted: ₦${amount.toLocaleString()} disbursed via Squad Transfer API (Ref: ${transactionRef})`
        }
      });

      console.log(`[loan-disbursement] ₦${amount.toLocaleString()} loan disbursed to ${trader.businessName} (${trader.squadVirtualAccount})`);

      res.status(200).json({
        data: {
          traderId: trader.id,
          loanAmount: amount,
          transactionReference: transactionRef,
          newOutstandingBalance: updatedTrader.outstandingBalance,
          availableCreditRemaining: trader.creditLimit - updatedTrader.outstandingBalance,
          disbursementStatus: 'completed'
        },
        error: null
      });

    } catch (disbursementError) {
      console.error('[loan-disbursement] Squad Transfer API failed:', disbursementError);
      
      res.status(500).json({
        data: null,
        error: 'Loan disbursement failed. Please try again or contact support.'
      });
    }

  } catch (error) {
    console.error('Error processing loan acceptance:', error);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
}