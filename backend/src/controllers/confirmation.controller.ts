import { Request, Response } from 'express';
import { ConfirmationState } from '@prisma/client';
import { readConfirmationRequest, respondToConfirmation } from '../services/confirmation.service';

function toResponseState(state: ConfirmationState): string {
  return state.toLowerCase();
}

export async function getConfirmation(req: Request, res: Response): Promise<void> {
  const token = req.params['token'];
  if (!token) {
    res.status(400).json({ data: null, error: 'Confirmation token is required' });
    return;
  }

  try {
    const result = await readConfirmationRequest(token);
    if (result.kind === 'not-found') {
      res.status(404).json({ data: null, error: 'Confirmation request not found' });
      return;
    }
    if (result.kind === 'expired') {
      res.status(410).json({ data: { state: 'expired' }, error: 'Confirmation link has expired' });
      return;
    }
    if (result.kind === 'already-used') {
      res.status(409).json({
        data: { state: toResponseState(result.state) },
        error: 'Confirmation request has already been used',
      });
      return;
    }

    res.status(200).json({
      data: { ...result, state: toResponseState(result.state) },
      error: null,
    });
  } catch (error) {
    console.error('[confirmation-read] Failed to read request:', error);
    res.status(500).json({ data: null, error: 'Unable to read confirmation request' });
  }
}

export async function respondConfirmation(req: Request, res: Response): Promise<void> {
  const token = req.params['token'];
  if (!token) {
    res.status(400).json({ data: null, error: 'Confirmation token is required' });
    return;
  }

  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const decision = body['decision'];
  if (Object.keys(body).length !== 1 || (decision !== 'confirmed' && decision !== 'declined')) {
    res.status(400).json({ data: null, error: 'decision must be confirmed or declined' });
    return;
  }

  try {
    const result = await respondToConfirmation(token, decision);
    if (result.kind === 'not-found') {
      res.status(404).json({ data: null, error: 'Confirmation request not found' });
      return;
    }
    if (result.kind === 'expired') {
      res.status(410).json({ data: { state: 'expired' }, error: 'Confirmation link has expired' });
      return;
    }
    if (result.kind === 'already-used') {
      res.status(409).json({
        data: { state: toResponseState(result.state) },
        error: 'Confirmation request has already been used',
      });
      return;
    }

    res.status(200).json({
      data: { state: toResponseState(result.state), respondedAt: result.respondedAt },
      error: null,
    });
  } catch (error) {
    console.error('[confirmation-response] Failed to record response:', error);
    res.status(500).json({ data: null, error: 'Unable to record confirmation response' });
  }
}
