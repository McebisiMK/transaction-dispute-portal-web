import type { ChipProps } from '@mui/material/Chip';
import type { DisputeReason, DisputeStatus } from '@/codegen/api-client';

/* ========================================================================================= */

export const DISPUTE_STATUSES: DisputeStatus[] = ['Submitted', 'UnderReview', 'Approved', 'Rejected', 'Withdrawn'];

export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  Submitted:   'Submitted',
  UnderReview: 'Under review',
  Approved:    'Approved',
  Rejected:    'Rejected',
  Withdrawn:   'Withdrawn',
};

export const DISPUTE_STATUS_COLORS: Record<DisputeStatus, ChipProps['color']> = {
  Submitted:   'info',
  UnderReview: 'warning',
  Approved:    'success',
  Rejected:    'error',
  Withdrawn:   'default',
};

export const DISPUTE_REASON_LABELS: Record<DisputeReason, string> = {
  UnauthorisedTransaction:    'Unauthorised transaction',
  DuplicateCharge:            'Duplicate charge',
  IncorrectAmount:            'Incorrect amount',
  GoodsOrServicesNotReceived: 'Goods or services not received',
  NotAsDescribed:             'Not as described',
  CancelledSubscription:      'Cancelled subscription',
  RefundNotReceived:          'Refund not received',
  Other:                      'Other',
};

export const DISPUTE_REASONS = Object.keys(DISPUTE_REASON_LABELS) as DisputeReason[];

export const DISPUTE_DESCRIPTION_MAX_LENGTH = 1000;

export const DISPUTE_COMMENT_MAX_LENGTH = 1000;
