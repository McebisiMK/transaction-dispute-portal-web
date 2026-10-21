import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      env: {
        VITE_API_BASE_URL:       'http://api.test',
        VITE_WEB_BASE_URL:       'http://localhost:3000',
        VITE_KEYCLOAK_AUTHORITY: 'http://keycloak.test/realms/transaction-dispute-portal',
        VITE_KEYCLOAK_CLIENT_ID: 'dispute-portal-web',
      },
    },
  }),
);
