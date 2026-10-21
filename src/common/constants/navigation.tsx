import { Gavel as GavelIcon } from '@mui/icons-material';
import { ROLES } from '@/config-global';
import type { NavigationItem } from '@/common/types/navigation';

/* ====================================================================== */

export const NAV_ITEMS: NavigationItem[] = [
  {
    id: 'disputes',
    label: 'My Disputes',
    path: '/disputes',
    icon: <GavelIcon fontSize="small" />,
    roles: [ROLES.CUSTOMER],
  },
];
