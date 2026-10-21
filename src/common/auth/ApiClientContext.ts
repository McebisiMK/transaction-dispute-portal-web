import { createContext } from 'react';
import type { AgentDisputesClient, DisputesClient, TransactionsClient } from '@/codegen/api-client';

export type ApiClientContextValue = {
  transactions:  TransactionsClient;
  disputes:      DisputesClient;
  agentDisputes: AgentDisputesClient;
};

export const ApiClientContext = createContext<ApiClientContextValue | null>(null);
