export const CONFIG = {
  appName:      'Dispute Portal',
  defaultTheme: 'light',
  storageKeys: {
    theme:    'app:theme',
  },
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
} as const;

export const AUTH_CONFIG = {
  AUTHORITY:    import.meta.env.VITE_KEYCLOAK_AUTHORITY ?? '',
  CLIENT_ID:    import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? '',
  SCOPE:        'openid profile email',
  REDIRECT_URI: import.meta.env.VITE_WEB_BASE_URL ?? (typeof window !== 'undefined' ? window.location.origin : ''),
} as const;

export const ROLES = {
  CUSTOMER: 'customer',
  AGENT:    'agent',
} as const;
