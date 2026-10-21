import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enZA } from 'date-fns/locale';
import { AgentDisputesClient, DisputesClient, TransactionsClient, type ApiClientConfig } from '@/codegen/api-client';
import { ApiClientContext, type ApiClientContextValue } from '@/common/auth/ApiClientContext';
import { API_CONFIG } from '@/config-global';
import { AppThemeProvider, ThemeSettings } from '@/theme';

/* ========================================================================================= */

interface RenderWithProvidersOptions {
  path?:  string;
  route?: string;
}

const createApiClients = (): ApiClientContextValue => {
  const config: ApiClientConfig = { getAccessToken: () => 'test-token' };

  return {
    transactions:  new TransactionsClient(config, API_CONFIG.BASE_URL),
    disputes:      new DisputesClient(config, API_CONFIG.BASE_URL),
    agentDisputes: new AgentDisputesClient(config, API_CONFIG.BASE_URL),
  };
};

export const renderWithProviders = (ui: ReactElement, { path = '/', route = path }: RenderWithProvidersOptions = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter([{ path, element: ui }, { path: '*', element: null }], { initialEntries: [route] });

  const result = render(
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enZA}>
      <AppThemeProvider>
        <ThemeSettings>
          <SnackbarProvider>
            <ApiClientContext.Provider value={createApiClients()}>
              <QueryClientProvider client={queryClient}>
                <HelmetProvider>
                  <RouterProvider router={router} />
                </HelmetProvider>
              </QueryClientProvider>
            </ApiClientContext.Provider>
          </SnackbarProvider>
        </ThemeSettings>
      </AppThemeProvider>
    </LocalizationProvider>,
  );

  return { ...result, router, queryClient };
};
