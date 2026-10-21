import type { AccountType } from '@/codegen/api-client';

/* ========================================================================================= */

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  Cheque:     'Cheque',
  Savings:    'Savings',
  CreditCard: 'Credit card',
};
