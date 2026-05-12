import axios from 'axios';
import { config } from '../config/env';

interface VirtualAccountPayload {
  customer_identifier: string;
  first_name: string;
  last_name: string;
  mobile_num: string;
  email: string;
  bvn: string;
}

interface VirtualAccountResponse {
  virtual_account_number: string;
}

export async function createVirtualAccount(
  payload: VirtualAccountPayload
): Promise<VirtualAccountResponse> {
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
}
