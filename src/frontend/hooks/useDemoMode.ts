import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export interface DemoModeResponse {
  enabled: boolean;
}

export function useDemoMode() {
  return useQuery({
    queryKey: ['demo-mode'],
    queryFn: () => fetchJson<DemoModeResponse>('/api/admin/demo-mode')
  });
}

export function useSetDemoMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) =>
      fetchJson<DemoModeResponse>('/api/admin/demo-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-mode'] });
    }
  });
}
