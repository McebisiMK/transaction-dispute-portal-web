import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/common/auth';
import type { DisputeReason, DisputeStatus, TransactionStatus } from '@/codegen/api-client';

/* ========================================================================================= */

export interface LookupItem<TId extends string> {
  id:   TId;
  name: string;
}

export const lookupKeys = {
  all: ['lookups'] as const,
};

/* ========================================================================================= */

export const useLookups = () => {
  const { lookups } = useApiClient();

  return useQuery({
    queryKey: lookupKeys.all,
    queryFn: ({ signal }) => lookups.getLookups(signal),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useDisputeReasons = (): LookupItem<DisputeReason>[] => {
  return useLookups().data?.disputeReasons ?? [];
};

export const useDisputeStatuses = (): LookupItem<DisputeStatus>[] => {
  return useLookups().data?.disputeStatuses ?? [];
};

export const useTransactionStatuses = (): LookupItem<TransactionStatus>[] => {
  return useLookups().data?.transactionStatuses ?? [];
};

export const getLookupName = <TId extends string>(items: LookupItem<TId>[], id: TId): string => {
  return items.find((item) => item.id === id)?.name ?? id;
};
