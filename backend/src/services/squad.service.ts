import axios from "axios";
import { config } from "../config/env";

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

interface TransferResponse {
  success: boolean;
  message: string;
  data: {
    transaction_reference: string;
    amount: string;
  };
}

export async function createVirtualAccount(
  payload: VirtualAccountPayload,
): Promise<VirtualAccountResponse> {
  try {
    const response = await axios.post<{ data: VirtualAccountResponse }>(
      `${config.squadBaseUrl}/virtual-account`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${config.squadSecretKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      `Squad API failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function disburseLoan(
  amount: number,
  virtualAccount: string,
  traderName: string,
  transactionRef: string,
): Promise<TransferResponse> {
  try {
    const transferPayload = {
      remark: `Loan disbursement to ${traderName}`,
      bank_code: "000013",
      currency_id: "NGN",
      amount: (amount * 100).toString(), // Convert to kobo
      account_number: virtualAccount,
      transaction_reference: transactionRef,
      account_name: traderName,
    };

    const response = await axios.post<TransferResponse>(
      `${config.squadBaseUrl}/payout/transfer`,
      transferPayload,
      {
        headers: {
          Authorization: `Bearer ${config.squadSecretKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    console.log(
      `✅ Loan disbursed: ₦${amount.toLocaleString()} to ${virtualAccount}`,
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Loan disbursement failed:`, error);
    throw new Error(
      `Squad Transfer API failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
