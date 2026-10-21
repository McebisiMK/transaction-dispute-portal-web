import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/common/auth';
import type { CreateDisputeCommand, DisputeStatus } from '@/codegen/api-client';
import { transactionKeys } from '@/features/transactions/queries';

/* ========================================================================================= */

export interface DisputeFilters {
  status?:    DisputeStatus;
  fromDate?:  string;
  toDate?:    string;
  pageNumber: number;
  pageSize:   number;
}

export const disputeKeys = {
  all:     ['disputes'] as const,
  lists:   () => [...disputeKeys.all, 'list'] as const,
  list:    (filters: DisputeFilters) => [...disputeKeys.lists(), filters] as const,
  details: () => [...disputeKeys.all, 'detail'] as const,
  detail:  (id: string) => [...disputeKeys.details(), id] as const,
};

/* ========================================================================================= */

export const useDisputes = (filters: DisputeFilters) => {
  const { disputes } = useApiClient();

  return useQuery({
    queryKey: disputeKeys.list(filters),
    queryFn: ({ signal }) => disputes.getDisputes(filters.fromDate, filters.toDate, filters.status, filters.pageNumber, filters.pageSize, signal),
    placeholderData: keepPreviousData,
  });
};

export const useDispute = (id: string) => {
  const { disputes } = useApiClient();

  return useQuery({
    queryKey: disputeKeys.detail(id),
    queryFn: ({ signal }) => disputes.getDisputeById(id, signal),
  });
};

export const useCreateDispute = () => {
  const { disputes } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: CreateDisputeCommand) => disputes.createDispute(command),
    meta: { inlineErrors: true },
    onSuccess: (dispute) => {
      queryClient.setQueryData(disputeKeys.detail(dispute.id), dispute);
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
};

export const useWithdrawDispute = (id: string) => {
  const { disputes } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment?: string) => disputes.withdrawDispute(id, { comment }),
    meta: { inlineErrors: true },
    onSuccess: (dispute) => {
      queryClient.setQueryData(disputeKeys.detail(id), dispute);
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
    onError: () => queryClient.invalidateQueries({ queryKey: disputeKeys.detail(id) }),
  });
};
