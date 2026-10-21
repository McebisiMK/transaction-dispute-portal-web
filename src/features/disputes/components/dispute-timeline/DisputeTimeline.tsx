import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import type { DisputeStatus, DisputeStatusHistoryModel } from '@/codegen/api-client';
import { formatDateTime } from '@/common/utils/format';
import { DisputeStatusChip } from '../dispute-status-chip';
import { DISPUTE_STATUS_COLORS, DISPUTE_STATUS_LABELS } from '../../constants';
import { insetSx } from '../../styles';

/* ==================================================================================== */

const STATUS_ICONS: Record<DisputeStatus, ReactNode> = {
  Submitted:   <NorthRoundedIcon />,
  UnderReview: <PriorityHighRoundedIcon />,
  Approved:    <CheckRoundedIcon />,
  Rejected:    <CloseRoundedIcon />,
  Withdrawn:   <UndoRoundedIcon />,
};

const MARKER_SIZE = 24;

interface DisputeTimelineProps {
  timeline: DisputeStatusHistoryModel[];
}

const DisputeTimeline = ({ timeline }: DisputeTimelineProps) => {
  const entries = [...timeline].reverse();

  return (
    <Box component="ol" sx={{ listStyle: 'none', m: 0, py: 1.5, px: 0 }}>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const color = DISPUTE_STATUS_COLORS[entry.toStatus];

        return (
          <Box component="li" key={`${entry.changedAt}-${entry.toStatus}`} sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={(theme) => ({
                  width: MARKER_SIZE,
                  height: MARKER_SIZE,
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  color: theme.palette.common.white,
                  bgcolor: color === 'default' || !color ? theme.palette.grey[500] : theme.palette[color].main,
                  boxShadow: `0 0 0 4px ${theme.palette.background.paper}`,
                  '& svg': { fontSize: 15 },
                })}
              >
                {STATUS_ICONS[entry.toStatus]}
              </Box>
              {!isLast && <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', my: 0.75 }} />}
            </Box>

            <Box sx={{ pb: isLast ? 0 : 3.5, flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minHeight: MARKER_SIZE }}>
                <DisputeStatusChip status={entry.toStatus} />
                {entry.fromStatus && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      from
                    </Typography>
                    <Box
                      component="span"
                      sx={[{ typography: 'caption', fontWeight: 600, px: 1, py: 0.25, borderRadius: 0.75 }, insetSx]}
                    >
                      {DISPUTE_STATUS_LABELS[entry.fromStatus]}
                    </Box>
                  </>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.75 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {formatDateTime(entry.changedAt)}
                </Typography>
                <Typography variant="caption" color="text.disabled" aria-hidden>
                  •
                </Typography>
                <Box
                  component="code"
                  sx={(theme) => ({
                    typography: 'caption',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    px: 0.75,
                    py: 0.125,
                    borderRadius: 0.75,
                    color: theme.palette.secondary.main,
                    bgcolor: alpha(theme.palette.secondary.main, 0.12),
                  })}
                >
                  {entry.changedBy}
                </Box>
              </Box>

              {entry.comment && (
                <Typography
                  variant="body2"
                  sx={[{ mt: 1.25, px: 2, py: 1.5, borderRadius: 1, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }, insetSx]}
                >
                  {entry.comment}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

/* ==================================================================================== */

export default DisputeTimeline;
