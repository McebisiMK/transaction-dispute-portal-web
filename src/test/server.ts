import { setupServer } from 'msw/node';
import { API_CONFIG } from '@/config-global';

/* ========================================================================================= */

export const server = setupServer();

export const apiUrl = (path: string): string => `${API_CONFIG.BASE_URL}/api/v1${path}`;
