import { format, parseISO } from 'date-fns';

/* ========================================================================================= */

const LOCALE = 'en-ZA';

export const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).format(amount);

// API dates are UTC ISO strings; show them in the browser's time zone.
export const formatDate = (value: string): string => format(parseISO(value), 'dd MMM yyyy');

export const formatDateTime = (value: string): string => format(parseISO(value), 'dd MMM yyyy, HH:mm');

// The API's fromDate/toDate filters are calendar days (yyyy-MM-dd).
export const toApiDate = (value: Date): string => format(value, 'yyyy-MM-dd');

export const fromApiDate = (value: string | null): Date | null => (value ? parseISO(value) : null);
