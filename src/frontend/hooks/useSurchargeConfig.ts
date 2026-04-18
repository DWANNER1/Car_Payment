import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';
import type { PrototypeSurchargeRules } from '../../shared/prototype';
import { prototypeSeed } from '../../shared/prototype';

export function useSurchargeConfig() {
  return useQuery({
    queryKey: ['surcharge-config'],
    queryFn: async () => {
      try {
        return await fetchJson<PrototypeSurchargeRules>('/api/admin/surcharge-config');
      } catch {
        return prototypeSeed.surchargeRules;
      }
    },
    initialData: prototypeSeed.surchargeRules
  });
}

export function useSetSurchargeConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PrototypeSurchargeRules>) =>
      fetchJson<PrototypeSurchargeRules>('/api/admin/surcharge-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surcharge-config'] });
      queryClient.invalidateQueries({ queryKey: ['demo-prototype-data'] });
    }
  });
}
