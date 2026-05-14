import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/crypto.util';
import { createVirtualAccount } from '../services/squad.service';

const prisma = new PrismaClient();

interface OnboardPayload {
  phoneNumber: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  bvn: string;
  dob: string;
  address: string;
  gender: string;
  beneficiaryAccount: string;
}

function isOnboardPayload(body: unknown): body is OnboardPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b['phoneNumber'] === 'string' &&
    typeof b['businessName'] === 'string' &&
    typeof b['firstName'] === 'string' &&
    typeof b['lastName'] === 'string' &&
    typeof b['email'] === 'string' &&
    typeof b['bvn'] === 'string' &&
    typeof b['dob'] === 'string' &&
    typeof b['address'] === 'string' &&
    typeof b['gender'] === 'string' &&
    typeof b['beneficiaryAccount'] === 'string'
  );
}

export async function onboardTrader(req: Request, res: Response): Promise<void> {
  if (!isOnboardPayload(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  const { phoneNumber, businessName, firstName, lastName, email, bvn, dob, address, gender, beneficiaryAccount } = req.body;

  const encryptedBvn = encrypt(bvn);

  const virtualAccountData = await createVirtualAccount({
    customer_identifier: phoneNumber,
    first_name: firstName,
    last_name: lastName,
    mobile_num: phoneNumber,
    email,
    bvn,
    dob,
    address,
    gender,
    beneficiary_account: beneficiaryAccount,
  });

  const trader = await prisma.trader.create({
    data: {
      phoneNumber,
      businessName,
      squadVirtualAccount: virtualAccountData.virtual_account_number,
      kycProfile: {
        create: { encryptedBvn },
      },
    },
  });

  res.status(201).json({
    data: {
      traderId: trader.id,
      virtualAccount: trader.squadVirtualAccount,
    },
    error: null,
  });
}
