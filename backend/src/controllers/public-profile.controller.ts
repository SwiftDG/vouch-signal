import { Request, Response } from 'express';
import { getPublicBusinessProfile } from '../services/public-profile.service';

export async function getPublicProfile(req: Request, res: Response): Promise<void> {
  const slug = req.params['slug'];
  if (!slug) {
    res.status(400).json({ data: null, error: 'Public profile slug is required' });
    return;
  }

  try {
    const profile = await getPublicBusinessProfile(slug);
    if (!profile) {
      res.status(404).json({ data: null, error: 'Public profile not found' });
      return;
    }
    res.status(200).json({ data: profile, error: null });
  } catch (error) {
    console.error('[public-profile] Failed to read profile:', error);
    res.status(500).json({ data: null, error: 'Unable to read public profile' });
  }
}