/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WEB_BASE_URL: string;
  readonly VITE_KEYCLOAK_AUTHORITY: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly MODE: 'development' | 'qa' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __APP_CONFIG__?: Partial<Record<'API_BASE_URL' | 'WEB_BASE_URL' | 'KEYCLOAK_AUTHORITY' | 'KEYCLOAK_CLIENT_ID', string>>;
}
