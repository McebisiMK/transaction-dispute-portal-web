import { Gavel as GavelIcon, ReceiptLong as ReceiptLongIcon } from '@mui/icons-material';
import { ROLES } from '@/config-global';
import type { NavigationItem } from '@/common/types/navigation';

/* ====================================================================== */

export const NAV_ITEMS: NavigationItem[] = [
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: <ReceiptLongIcon fontSize="small" />,
    roles: [ROLES.CUSTOMER],
  },
  {
    id: 'disputes',
    label: 'My Disputes',
    path: '/disputes',
    icon: <GavelIcon fontSize="small" />,
    roles: [ROLES.CUSTOMER],
  },
];
