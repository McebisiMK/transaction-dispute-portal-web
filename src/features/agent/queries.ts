import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/common/auth';
import type { DisputeStatus, UpdateDisputeStatusRequest } from '@/codegen/api-client';
import { isApiException } from '@/lib/apiErrors';

/* ========================================================================================= */

export interface QueueFilters {
  status?:    DisputeStatus;
  pageNumber: number;
  pageSize:   number;
}

export const agentDisputeKeys = {
  all:     ['agent-disputes'] as const,
  lists:   () => [...agentDisputeKeys.all, 'list'] as const,
  list:    (filters: QueueFilters) => [...agentDisputeKeys.lists(), filters] as const,
  details: () => [...agentDisputeKeys.all, 'detail'] as const,
  detail:  (id: string) => [...agentDisputeKeys.details(), id] as const,
};

/* ========================================================================================= */

export const useDisputeQueue = (filters: QueueFilters) => {
  const { agentDisputes } = useApiClient();

  return useQuery({
    queryKey: agentDisputeKeys.list(filters),
    queryFn: ({ signal }) => agentDisputes.getDisputeQueue(filters.status, filters.pageNumber, filters.pageSize, signal),
    placeholderData: keepPreviousData,
  });
};

export const useAgentDispute = (id: string) => {
  const { agentDisputes } = useApiClient();

  return useQuery({
    queryKey: agentDisputeKeys.detail(id),
    queryFn: ({ signal }) => agentDisputes.getDisputeById(id, signal),
  });
};

export const useUpdateDisputeStatus = (id: string) => {
  const { agentDisputes } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateDisputeStatusRequest) => agentDisputes.updateDisputeStatus(id, request),
    meta: { inlineErrors: true },
    onSuccess: (dispute) => {
      queryClient.setQueryData(agentDisputeKeys.detail(id), dispute);
      queryClient.invalidateQueries({ queryKey: agentDisputeKeys.lists() });
    },
    onError: (error) => {
      if (isApiException(error) && error.status === 409) {
        queryClient.invalidateQueries({ queryKey: agentDisputeKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: agentDisputeKeys.lists() });
      }
    },
  });
};
