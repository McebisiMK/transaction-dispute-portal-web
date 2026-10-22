import { type ReactNode, useMemo } from 'react';
import { API_CONFIG } from '@/config-global';
import { AgentDisputesClient, DisputesClient, LookupsClient, TransactionsClient, type ApiClientConfig } from '@/codegen/api-client';
import { ApiClientContext } from '../../ApiClientContext';
import { useAuth } from '../../useAuth';

/* ================================================================================================================================ */

/* -------------------------------------------------------------------------- */

if (!API_CONFIG.BASE_URL) throw new Error('Please set VITE_API_BASE_URL environment variable');

/* -------------------------------------------------------------------------- */

// Wraps the NSwag-generated clients; each request asks AuthProvider for a fresh Keycloak access token.
const ApiClientProvider = ({ children }: { children: ReactNode }) => {
  const { getTokenSilently } = useAuth();

  const value = useMemo(() => {
    const config: ApiClientConfig = { getAccessToken: getTokenSilently };
    const http = { fetch: (url: RequestInfo, init?: RequestInit) => window.fetch(url, init) };

    return {
      transactions:  new TransactionsClient(config, API_CONFIG.BASE_URL, http),
      disputes:      new DisputesClient(config, API_CONFIG.BASE_URL, http),
      agentDisputes: new AgentDisputesClient(config, API_CONFIG.BASE_URL, http),
      lookups:       new LookupsClient(config, API_CONFIG.BASE_URL, http),
    };
  }, [getTokenSilently]);

  return <ApiClientContext.Provider value={value}>{children}</ApiClientContext.Provider>;
};

/* ================================================================================================================================ */

export default ApiClientProvider;
