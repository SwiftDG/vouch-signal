import { Request, Response } from 'express';
import { BusinessType, EvidenceType, Prisma } from '@prisma/client';
import { createConfirmationRequest } from '../services/confirmation.service';
import { getBusinessProfile, onboardBusinessProfile, updateBusinessProfile } from '../services/profile.service';
import { createBusinessEvidence, listBusinessEvidence } from '../services/evidence.service';

const optionalFields = ['category', 'bio', 'location', 'contactUrl'] as const;
const editableFields = ['businessName', 'businessType', 'publicSlug', ...optionalFields] as const;

export async function getMyProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ data: null, error: 'User not authenticated' });
    return;
  }

  try {
    const profile = await getBusinessProfile(userId);
    if (!profile) {
      res.status(404).json({ data: null, error: 'Business profile not found' });
      return;
    }
    res.status(200).json({ data: profile, error: null });
  } catch (error) {
    console.error('[profile-read] Failed to read profile:', error);
    res.status(500).json({ data: null, error: 'Unable to read business profile' });
  }
}

export async function createEvidence(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ data: null, error: 'User not authenticated' });
    return;
  }

  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const title = typeof body['title'] === 'string' ? body['title'].trim() : '';
  const evidenceType = body['evidenceType'];
  const completedDate = typeof body['completedDate'] === 'string' ? new Date(body['completedDate']) : null;

  if (
    !title ||
    typeof evidenceType !== 'string' ||
    !Object.values(EvidenceType).includes(evidenceType as EvidenceType) ||
    !completedDate ||
    Number.isNaN(completedDate.getTime())
  ) {
    res.status(400).json({ data: null, error: 'title, evidenceType, and a valid completedDate are required' });
    return;
  }

  if (['description', 'customerName'].some((field) => body[field] !== undefined && body[field] !== null && typeof body[field] !== 'string')) {
    res.status(400).json({ data: null, error: 'description and customerName must be strings or null' });
    return;
  }

  try {
    const evidence = await createBusinessEvidence(userId, {
      title,
      evidenceType: evidenceType as EvidenceType,
      completedDate,
      description: normalizeOptionalField(body['description']),
      customerName: normalizeOptionalField(body['customerName']),
    });
    if (!evidence) {
      res.status(404).json({ data: null, error: 'Business profile not found' });
      return;
    }
    res.status(201).json({ data: evidence, error: null });
  } catch (error) {
    console.error('[evidence-create] Failed to create evidence:', error);
    res.status(500).json({ data: null, error: 'Unable to create evidence' });
  }
}

export async function getMyEvidence(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ data: null, error: 'User not authenticated' });
    return;
  }

  try {
    const evidence = await listBusinessEvidence(userId);
    if (evidence === null) {
      res.status(404).json({ data: null, error: 'Business profile not found' });
      return;
    }
    res.status(200).json({ data: evidence, error: null });
  } catch (error) {
    console.error('[evidence-list] Failed to list evidence:', error);
    res.status(500).json({ data: null, error: 'Unable to list evidence' });
  }
}

export async function requestEvidenceConfirmation(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ data: null, error: 'User not authenticated' });
    return;
  }

  const evidenceId = req.params['id'];
  if (!evidenceId) {
    res.status(400).json({ data: null, error: 'Evidence ID is required' });
    return;
  }

  try {
    const result = await createConfirmationRequest(userId, evidenceId);
    if (result.kind === 'not-found') {
      res.status(404).json({ data: null, error: 'Evidence not found' });
      return;
    }
    if (result.kind === 'already-confirmed') {
      res.status(409).json({ data: null, error: 'This evidence has already been confirmed' });
      return;
    }
    res.status(201).json({
      data: { token: result.request.token, expiresAt: result.request.expiresAt },
      error: null,
    });
  } catch (error) {
    console.error('[confirmation-request] Failed to create request:', error);
    res.status(500).json({ data: null, error: 'Unable to create confirmation request' });
  }
}

export async function updateMyProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ data: null, error: 'User not authenticated' });
    return;
  }

  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const providedFields = editableFields.filter((field) => body[field] !== undefined);
  if (providedFields.length === 0) {
    res.status(400).json({ data: null, error: 'At least one editable profile field is required' });
    return;
  }

  if (optionalFields.some((field) => body[field] !== undefined && body[field] !== null && typeof body[field] !== 'string')) {
    res.status(400).json({ data: null, error: 'Optional profile fields must be strings or null' });
    return;
  }

  const update: Record<string, unknown> = {};
  if (body['businessName'] !== undefined) {
    if (typeof body['businessName'] !== 'string' || !body['businessName'].trim()) {
      res.status(400).json({ data: null, error: 'businessName must be a non-empty string' });
      return;
    }
    update['businessName'] = body['businessName'].trim();
  }

  if (body['businessType'] !== undefined) {
    if (typeof body['businessType'] !== 'string' || !Object.values(BusinessType).includes(body['businessType'] as BusinessType)) {
      res.status(400).json({ data: null, error: 'businessType must be VENDOR or FREELANCER' });
      return;
    }
    update['businessType'] = body['businessType'];
  }

  if (body['publicSlug'] !== undefined) {
    if (typeof body['publicSlug'] !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body['publicSlug'].trim())) {
      res.status(400).json({ data: null, error: 'publicSlug must use lowercase letters, digits, and hyphens' });
      return;
    }
    update['publicSlug'] = body['publicSlug'].trim();
  }

  for (const field of optionalFields) {
    if (body[field] !== undefined) update[field] = normalizeOptionalField(body[field]);
  }

  try {
    const profile = await updateBusinessProfile(userId, update);
    res.status(200).json({ data: profile, error: null });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ data: null, error: 'Business profile not found' });
      return;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json({ data: null, error: 'That public slug is already in use' });
      return;
    }

    console.error('[profile-update] Failed to update profile:', error);
    res.status(500).json({ data: null, error: 'Unable to update business profile' });
  }
}

export async function onboardProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ data: null, error: 'User not authenticated' });
    return;
  }

  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  const body = req.body as Record<string, unknown>;
  const businessName = typeof body['businessName'] === 'string' ? body['businessName'].trim() : '';
  const publicSlug = typeof body['publicSlug'] === 'string' ? body['publicSlug'].trim() : '';
  const businessType = body['businessType'];

  if (
    !businessName ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(publicSlug) ||
    typeof businessType !== 'string' ||
    !Object.values(BusinessType).includes(businessType as BusinessType)
  ) {
    res.status(400).json({ data: null, error: 'businessName, businessType, and a lowercase publicSlug are required' });
    return;
  }

  if (optionalFields.some((field) => body[field] !== undefined && body[field] !== null && typeof body[field] !== 'string')) {
    res.status(400).json({ data: null, error: 'Optional profile fields must be strings or null' });
    return;
  }

  try {
    const profile = await onboardBusinessProfile(userId, {
      businessName,
      businessType: businessType as BusinessType,
      publicSlug,
      category: normalizeOptionalField(body['category']),
      bio: normalizeOptionalField(body['bio']),
      location: normalizeOptionalField(body['location']),
      contactUrl: normalizeOptionalField(body['contactUrl']),
    });

    res.status(200).json({ data: profile, error: null });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json({ data: null, error: 'That public slug is already in use' });
      return;
    }

    console.error('[profile-onboard] Failed to create profile:', error);
    res.status(500).json({ data: null, error: 'Unable to create business profile' });
  }
}

function normalizeOptionalField(value: unknown): string | null | undefined {
  if (typeof value !== 'string') return value === null ? null : undefined;
  return value.trim() || null;
}