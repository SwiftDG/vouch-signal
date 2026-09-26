import { VerificationStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function getPublicBusinessProfile(publicSlug: string) {
  return prisma.businessProfile.findUnique({
    where: { publicSlug },
    select: {
      publicSlug: true,
      businessName: true,
      businessType: true,
      category: true,
      bio: true,
      location: true,
      contactUrl: true,
      evidence: {
        where: { verificationStatus: VerificationStatus.CUSTOMER_CONFIRMED },
        orderBy: [{ completedDate: 'desc' }, { createdAt: 'desc' }],
        select: {
          title: true,
          description: true,
          evidenceType: true,
          completedDate: true,
          verificationStatus: true,
        },
      },
    },
  });
}