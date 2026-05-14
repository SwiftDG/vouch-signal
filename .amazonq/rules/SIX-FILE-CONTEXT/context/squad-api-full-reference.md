# Squad (HabariPay) API Documentation - Virtual Accounts

## Overview
The Virtual Account API allows you to create dedicated NUBAN accounts for your customers to receive payments. This documentation includes the exact endpoints, required fields, and JSON payload structures as specified by the Squad API.

## Authentication
All requests to the Squad API require your Secret Key passed in the `Authorization` header as a Bearer token.
- **Header:** `Authorization: Bearer <Your_Secret_Key>`

## Environments
- **Sandbox:** `https://sandbox-api-d.squadco.com`
- **Production:** `https://api-d.squadco.com`

---

## Create Virtual Account (Individual / B2C)
Creates a dedicated virtual account for an individual customer.

**Endpoint:** `POST /virtual-account`

### Request Headers
- `Authorization`: `Bearer sandbox_sk_...`
- `Content-Type`: `application/json`

### Request Body Parameters
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `customer_identifier` | string | Yes | Unique identifier for the customer on your system. |
| `first_name` | string | Yes | Customer's first name. **Must match BVN exactly.** |
| `last_name` | string | Yes | Customer's last name. **Must match BVN exactly.** |
| `mobile_num` | string | Yes | Customer's mobile number (11 digits, e.g., 08012345678). |
| `email` | string | Yes | Customer's email address. |
| `bvn` | string | Yes | Customer's 11-digit Bank Verification Number. |
| `dob` | string | Yes | Customer's Date of Birth. **Format: mm/dd/yyyy**. |
| `address` | string | Yes | Customer's residential address. |
| `gender` | string | Yes | `"1"` for Male, `"2"` for Female. |
| `beneficiary_account` | string | Yes | 10-digit account number where funds will be settled. |

### Example Request (JSON)