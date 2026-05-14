import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { processWebhookTransaction } from '../services/transaction.service';
import { processAjoEvent } from '../services/ajo.service';

const prisma = new PrismaClient();

interface SquadWebhookPayload {
  Event: string;
  TransactionRef: string;
  trader_id?: string;
  [key: string]: unknown;
}

function isSquadPayload(body: unknown): body is SquadWebhookPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return typeof b['Event'] === 'string' && typeof b['TransactionRef'] === 'string';
}

async function processAsync(squadEventId: string, eventType: string, payload: SquadWebhookPayload): Promise<void> {
  if (eventType === 'charge.completed') {
    await processWebhookTransaction(squadEventId, payload);
  } else if (eventType === 'recurring.completed' || eventType === 'recurring.failed') {
    const traderId = typeof payload['trader_id'] === 'string' ? payload['trader_id'] : '';
    if (traderId) await processAjoEvent(traderId, eventType);
  }
}

export async function handleSquadWebhook(req: Request, res: Response): Promise<void> {
  if (!isSquadPayload(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid webhook payload' });
    return;
  }

  const { Event: eventType, TransactionRef: squadEventId } = req.body;

  // Idempotency check — return 200 immediately if already processed
  const existing = await prisma.webhookEvent.findUnique({
    where: { squadEventId },
  });

  if (existing) {
    res.status(200).json({ data: null, error: null });
    return;
  }

  // Log to audit table
  await prisma.webhookEvent.create({
    data: {
      squadEventId,
      eventType,
      payload: JSON.parse(JSON.stringify(req.body)),
      processingStatus: 'PENDING',
    },
  });

  // Acknowledge synchronously — hand off async per architecture invariant #4
  res.status(200).json({ data: null, error: null });

  processAsync(squadEventId, eventType, req.body).catch((err: Error) => {
    console.error(`[webhook] async processing failed: ${err.message}`);
  });
}
