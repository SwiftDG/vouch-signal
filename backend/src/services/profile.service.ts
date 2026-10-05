import { BusinessType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BusinessProfileInput {
  businessName: string;
  businessType: BusinessType;
  publicSlug: string;
  category?: string | null;
  bio?: string | null;
  location?: string | null;
  contactUrl?: string | null;
}

interface BusinessProfileUpdateInput {
  businessName?: string;
  businessType?: BusinessType;
  publicSlug?: string;
  category?: string | null;
  bio?: string | null;
  location?: string | null;
  contactUrl?: string | null;
}

const publicProfileSelect = {
  id: true,
  publicSlug: true,
  businessName: true,
  businessType: true,
  category: true,
  bio: true,
  location: true,
  contactUrl: true,
  createdAt: true,
  updatedAt: true,
};

export function getBusinessProfile(supabaseUserId: string) {
  return prisma.businessProfile.findUnique({
    where: { supabaseUserId },
    select: publicProfileSelect,
  });
}

export function updateBusinessProfile(supabaseUserId: string, data: BusinessProfileUpdateInput) {
  return prisma.businessProfile.update({
    where: { supabaseUserId },
    data,
    select: publicProfileSelect,
  });
}

export function onboardBusinessProfile(supabaseUserId: string, input: BusinessProfileInput) {
  return prisma.businessProfile.upsert({
    where: { supabaseUserId },
    create: {
      supabaseUserId,
      businessName: input.businessName,
      businessType: input.businessType,
      publicSlug: input.publicSlug,
      category: input.category,
      bio: input.bio,
      location: input.location,
      contactUrl: input.contactUrl,
    },
    update: {},
    select: publicProfileSelect,
  });
}