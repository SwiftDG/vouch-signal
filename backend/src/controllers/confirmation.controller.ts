import { Request, Response } from 'express';
import { confirmEvidence, readConfirmationRequest } from '../services/confirmation.service';

export async function getConfirmation(req: Request, res: Response): Promise<void> {
  const token = req.params['token'];
  if (!token) {
    res.status(400).json({ data: null, error: 'Confirmation token is required' });
    return;
  }

  try {
    const result = await readConfirmationRequest(token);
    if (result.kind === 'not-found') {
      res.status(404).json({ data: { state: 'UNKNOWN' }, error: 'Confirmation request not found' });
      return;
    }
    if (result.kind === 'expired') {
      res.status(410).json({ data: { state: 'EXPIRED' }, error: 'Confirmation link has expired' });
      return;
    }

    res.status(200).json({ data: result, error: null });
  } catch (error) {
    console.error('[confirmation-read] Failed to read request:', error);
    res.status(500).json({ data: null, error: 'Unable to read confirmation request' });
  }
}

export async function confirmRequest(req: Request, res: Response): Promise<void> {
  const token = req.params['token'];
  if (!token) {
    res.status(400).json({ data: null, error: 'Confirmation token is required' });
    return;
  }

  if (
    req.body !== undefined &&
    (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body))
  ) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  if (body['confirmerName'] !== undefined && body['confirmerName'] !== null && typeof body['confirmerName'] !== 'string') {
    res.status(400).json({ data: null, error: 'confirmerName must be a string or null' });
    return;
  }

  try {
    const result = await confirmEvidence(
      token,
      typeof body['confirmerName'] === 'string' ? body['confirmerName'] : null,
    );
    if (result.kind === 'not-found') {
      res.status(404).json({ data: null, error: 'Confirmation request not found' });
      return;
    }
    if (result.kind === 'expired') {
      res.status(410).json({ data: { state: 'EXPIRED' }, error: 'Confirmation link has expired' });
      return;
    }
    if (result.kind === 'already-confirmed') {
      res.status(409).json({ data: { state: 'CONFIRMED' }, error: 'Confirmation request has already been used' });
      return;
    }

    res.status(200).json({ data: { state: 'CONFIRMED', confirmedAt: result.confirmedAt }, error: null });
  } catch (error) {
    console.error('[confirmation-action] Failed to confirm evidence:', error);
    res.status(500).json({ data: null, error: 'Unable to confirm evidence' });
  }
}