import { Request, Response } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { processWebhookTransaction } from '../services/transaction.service';
import { processAjoEvent } from '../services/ajo.service';

const prisma = new PrismaClient();

// Note: We use a broader type here because the Ajo webhook 
// has a different shape than the Virtual Account webhook
interface WebhookPayload {
  Event?: string;
  Body?: any;
  transaction_reference?: string;
  virtual_account_number?: string;
  transaction_indicator?: string;
  [key: string]: any;
}

async function processAsync(eventId: string, payload: WebhookPayload, eventType: string): Promise<void> {
  try {
    if (eventType === 'virtual_account_credit' && payload.transaction_indicator === 'C') {
        // Standard loan repayment or account funding
        await processWebhookTransaction(eventId, payload as any);
    } 
    else if (eventType === 'recurring.completed' || eventType === 'recurring.failed') {
        // Ajo automated deduction
        await processAjoEvent(eventType, payload.Body);
    }
  } catch (err: any) {
    console.error(`[webhook] async processing failed: ${err.message}`);
  }
}

export async function handleSquadWebhook(req: Request, res: Response): Promise<void> {
  try {
      // 1. SECURITY: Verify the HMAC Signature using the RAW buffer
      const squadSignature = req.headers['x-squad-encrypted-body'] as string;
      const rawBody = req.body; // This is a Buffer because of express.raw()
      
      const hash = crypto
          .createHmac('sha512', process.env.SQUAD_SECRET_KEY as string)
          .update(rawBody)
          .digest('hex');

      if (hash !== squadSignature) {
          console.error("🚨 Webhook security breach attempt detected.");
          res.status(401).json({ data: null, error: 'Invalid webhook signature' });
          return;
      }

      // 2. PARSE: Now that it's verified, we can safely parse the JSON
      const payload: WebhookPayload = JSON.parse(rawBody.toString('utf8'));
      
      // Determine the event type and ID (Squad puts them in different places depending on the event)
      const eventType = payload.Event || 'virtual_account_credit';
      const squadEventId = payload.transaction_reference || (payload.Body && payload.Body.transaction_ref);

      if (!squadEventId) {
          res.status(400).json({ data: null, error: 'Missing transaction reference' });
          return;
      }

      // 3. IDEMPOTENCY: Check if we already processed this exact event
      const existing = await prisma.webhookEvent.findUnique({
          where: { squadEventId },
      });

      if (existing) {
          res.status(200).json({ data: null, error: null });
          return;
      }

      // 4. LOG: Save the event to the database immediately
      await prisma.webhookEvent.create({
          data: {
              squadEventId,
              eventType: eventType,
              payload: payload, // Prisma automatically handles the JSON serialization here
              processingStatus: 'PENDING',
          },
      });

      // 5. ACKNOWLEDGE: Tell Squad "We got it!" immediately so they don't retry
      res.status(200).json({ data: null, error: null });

      // 6. PROCESS: Run the heavy lifting in the background
      processAsync(squadEventId, payload, eventType);

  } catch (error) {
      console.error("[webhook] Critical error:", error);
      res.status(500).json({ data: null, error: 'Internal server error' });
  }
}