import type { ChipProps } from '@mui/material/Chip';
import type { DisputeStatus } from '@/codegen/api-client';

/* ========================================================================================= */

export const DISPUTE_STATUS_COLORS: Record<DisputeStatus, ChipProps['color']> = {
  Submitted:   'info',
  UnderReview: 'warning',
  Approved:    'success',
  Rejected:    'error',
  Withdrawn:   'default',
};

export const DISPUTE_DESCRIPTION_MAX_LENGTH = 1000;

export const DISPUTE_COMMENT_MAX_LENGTH = 1000;
