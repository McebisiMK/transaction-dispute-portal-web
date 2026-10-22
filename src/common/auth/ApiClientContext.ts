import { createContext } from 'react';
import type { AgentDisputesClient, DisputesClient, LookupsClient, TransactionsClient } from '@/codegen/api-client';

export type ApiClientContextValue = {
  transactions:  TransactionsClient;
  disputes:      DisputesClient;
  agentDisputes: AgentDisputesClient;
  lookups:       LookupsClient;
};

export const ApiClientContext = createContext<ApiClientContextValue | null>(null);
