import axios from 'axios';
import { config } from '../config/env';

interface VirtualAccountPayload {
  customer_identifier: string;
  first_name: string;
  last_name: string;
  mobile_num: string;
  email: string;
  bvn: string;
  dob: string;
  address: string;
  gender: string;
  beneficiary_account: string;
}

interface VirtualAccountResponse {
  virtual_account_number: string;
}

export async function createVirtualAccount(
  payload: VirtualAccountPayload
): Promise<VirtualAccountResponse> {
  try {
    const response = await axios.post<{ data: VirtualAccountResponse }>(
      `${config.squadBaseUrl}/virtual-account`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${config.squadSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Squad API error:', error.response?.data);
    }
    throw error;
  }
}


