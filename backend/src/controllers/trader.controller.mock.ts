// Mock trader controller for testing without database
import { Request, Response } from 'express';
import { encrypt } from '../utils/crypto.util';
import { createVirtualAccount } from '../services/squad.service';

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

export async function onboardTraderMock(req: Request, res: Response): Promise<void> {
  if (!isOnboardPayload(req.body)) {
    res.status(400).json({ data: null, error: 'Invalid request payload' });
    return;
  }

  const { phoneNumber, businessName, firstName, lastName, email, bvn, dob, address, gender, beneficiaryAccount } = req.body;

  console.log('🔧 MOCK MODE: Simulating trader onboarding');
  console.log('📱 Phone:', phoneNumber);
  console.log('🏪 Business:', businessName);

  try {
    // Test encryption
    const encryptedBvn = encrypt(bvn);
    console.log('🔐 BVN encrypted successfully');

    // Test Squad service (mocked)
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

    // Mock database response
    const mockTraderId = `trader_${Date.now()}`;
    
    console.log('✅ Mock trader created:', mockTraderId);
    console.log('💳 Virtual account:', virtualAccountData.virtual_account_number);

    res.status(201).json({
      data: {
        traderId: mockTraderId,
        virtualAccount: virtualAccountData.virtual_account_number,
        note: 'MOCK MODE: Database not connected'
      },
      error: null,
    });

  } catch (error) {
    console.error('❌ Mock onboarding failed:', error);
    res.status(500).json({
      data: null,
      error: 'Onboarding failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}