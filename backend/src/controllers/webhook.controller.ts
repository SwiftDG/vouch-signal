import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { processWebhookTransaction } from '../services/transaction.service';
import { processAjoEvent } from '../services/ajo.service';

const prisma = new PrismaClient();

interface SquadWebhookPayload {
  transaction_reference: string;
  virtual_account_number: string;
  principal_amount: string;
  transaction_indicator: string;
  sender_name?: string;
  [key: string]: unknown;
}

function isSquadPayload(body: unknown): body is SquadWebhookPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b['transaction_reference'] === 'string' &&
    typeof b['virtual_account_number'] === 'string' &&
    typeof b['transaction_indicator'] === 'string'
  );
}

async function processAsync(squadEventId: string, payload: SquadWebhookPayload): Promise<void> {
  // Only process credit transactions (C = credit, D = debit)
  if (payload.transaction_indicator === 'C') {
    await processWebhookTransaction(squadEventId, payload);
  }
}

export async function handleSquadWebhook(req: Request, res: Response): Promise<void> {
  if (!isSquadPayload(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid webhook payload' });
    return;
  }

  const squadEventId = req.body.transaction_reference;

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
      eventType: 'virtual_account_credit',
      payload: JSON.parse(JSON.stringify(req.body)),
      processingStatus: 'PENDING',
    },
  });

  res.status(200).json({ data: null, error: null });

  processAsync(squadEventId, req.body).catch((err: Error) => {
    console.error(`[webhook] async processing failed: ${err.message}`);
  });
}
