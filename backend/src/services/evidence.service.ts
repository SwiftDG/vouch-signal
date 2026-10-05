import { EvidenceType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EvidenceInput {
  title: string;
  evidenceType: EvidenceType;
  completedDate: Date;
  description?: string | null;
  customerName?: string | null;
}

const evidenceSelect = {
  id: true,
  businessProfileId: true,
  title: true,
  description: true,
  evidenceType: true,
  completedDate: true,
  customerName: true,
  verificationStatus: true,
  createdAt: true,
  updatedAt: true,
};

export async function createBusinessEvidence(supabaseUserId: string, input: EvidenceInput) {
  const profile = await prisma.businessProfile.findUnique({
    where: { supabaseUserId },
    select: { id: true },
  });
  if (!profile) return null;

  return prisma.evidence.create({
    data: {
      businessProfileId: profile.id,
      title: input.title,
      evidenceType: input.evidenceType,
      completedDate: input.completedDate,
      description: input.description,
      customerName: input.customerName,
    },
    select: evidenceSelect,
  });
}

export async function listBusinessEvidence(supabaseUserId: string) {
  const profile = await prisma.businessProfile.findUnique({
    where: { supabaseUserId },
    select: { id: true },
  });
  if (!profile) return null;

  return prisma.evidence.findMany({
    where: { businessProfileId: profile.id },
    orderBy: [{ completedDate: 'desc' }, { createdAt: 'desc' }],
    select: evidenceSelect,
  });
}