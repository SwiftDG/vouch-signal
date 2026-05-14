import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { processWebhookTransaction } from '../services/transaction.service';
import { processAjoEvent } from '../services/ajo.service';

const prisma = new PrismaClient();

interface SquadWebhookBody {
  amount: number;
  transaction_ref: string;
  transaction_status: string;
  merchant_id: string;
  currency: string;
  transaction_type: string;
  is_recurring: boolean;
  [key: string]: unknown;
}

interface SquadWebhookPayload {
  Event: string;
  TransactionRef: string;
  Body: SquadWebhookBody;
}

function isSquadPayload(body: unknown): body is SquadWebhookPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b['Event'] === 'string' &&
    typeof b['TransactionRef'] === 'string' &&
    typeof b['Body'] === 'object' && b['Body'] !== null
  );
}

async function processAsync(squadEventId: string, payload: SquadWebhookPayload): Promise<void> {
  if (payload.Body.is_recurring) {
    const event = payload.Body.transaction_status === 'Success'
      ? 'recurring.completed'
      : 'recurring.failed';

    const merchantId = payload.Body.merchant_id;
    const trader = await prisma.trader.findFirst({
      where: { squadVirtualAccount: merchantId },
    });

    if (trader) {
      await processAjoEvent(trader.id, event as 'recurring.completed' | 'recurring.failed');
    }
    return;
  }

  if (payload.Event === 'charge_successful' && payload.Body.transaction_status === 'Success') {
    await processWebhookTransaction(squadEventId, payload.Body);
  }
}

export async function handleSquadWebhook(req: Request, res: Response): Promise<void> {
  if (!isSquadPayload(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid webhook payload' });
    return;
  }

  const squadEventId = req.body.TransactionRef;

  const existing = await prisma.webhookEvent.findUnique({
    where: { squadEventId },
  });

  if (existing) {
    res.status(200).json({ data: null, error: null });
    return;
  }

  await prisma.webhookEvent.create({
    data: {
      squadEventId,
      eventType: req.body.Event,
      payload: JSON.parse(JSON.stringify(req.body)),
      processingStatus: 'PENDING',
    },
  });

  res.status(200).json({ data: null, error: null });

  processAsync(squadEventId, req.body).catch((err: Error) => {
    console.error(`[webhook] async processing failed: ${err.message}`);
  });
}
