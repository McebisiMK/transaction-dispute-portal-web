import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

/* ========================================================================================= */

export const insetSx = (theme: Theme): SystemStyleObject<Theme> => ({
  bgcolor: 'action.hover',
  border: '1px solid transparent',
  ...theme.applyStyles('dark', {
    bgcolor: theme.palette.background.default,
    borderColor: theme.palette.divider,
  }),
});
