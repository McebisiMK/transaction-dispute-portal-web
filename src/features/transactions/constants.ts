import type { ChipProps } from '@mui/material/Chip';
import type { TransactionCategory, TransactionStatus } from '@/codegen/api-client';

/* ========================================================================================= */

export const TRANSACTION_STATUSES: TransactionStatus[] = ['Pending', 'Posted'];

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  Pending: 'Pending',
  Posted:  'Posted',
};

export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, ChipProps['color']> = {
  Pending: 'warning',
  Posted:  'success',
};

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  Groceries:      'Groceries',
  Fuel:           'Fuel',
  Dining:         'Dining',
  Transport:      'Transport',
  Shopping:       'Shopping',
  Entertainment:  'Entertainment',
  Subscriptions:  'Subscriptions',
  Utilities:      'Utilities',
  Health:         'Health',
  Travel:         'Travel',
  CashWithdrawal: 'Cash withdrawal',
};

export const SEARCH_DEBOUNCE_MS = 400;

export const PENDING_DISPUTE_MESSAGE = "Pending transactions can be disputed once they've posted.";

export const CLOSED_DISPUTE_MESSAGE = 'This transaction can no longer be disputed.';
