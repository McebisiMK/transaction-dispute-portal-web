import { WebStorageStateStore } from 'oidc-client-ts';
import type { AuthProviderProps } from 'react-oidc-context';
import { AUTH_CONFIG } from '@/config-global';

/* ========================================================================================= */

if (!AUTH_CONFIG.AUTHORITY || !AUTH_CONFIG.CLIENT_ID || !AUTH_CONFIG.REDIRECT_URI) {
  throw new Error('Missing required Keycloak environment variables. Set VITE_KEYCLOAK_AUTHORITY, VITE_KEYCLOAK_CLIENT_ID, and VITE_WEB_BASE_URL.');
}

/* ========================================================================================= */

export const oidcConfig: AuthProviderProps = {
  authority:                AUTH_CONFIG.AUTHORITY,
  client_id:                AUTH_CONFIG.CLIENT_ID,
  redirect_uri:             AUTH_CONFIG.REDIRECT_URI,
  post_logout_redirect_uri: AUTH_CONFIG.REDIRECT_URI,
  scope:                    AUTH_CONFIG.SCOPE,
  automaticSilentRenew:     true,
  userStore:                new WebStorageStateStore({ store: window.sessionStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
