import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export function useMidMapping() {
  return useQuery({
    queryKey: ['mid-mapping'],
    queryFn: () => fetchJson<{ parts: string; service: string; body_shop: string }>('/api/admin/mid-mapping')
  });
}

export function useSetMidMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<{ parts: string; service: string; body_shop: string }>) => fetchJson('/api/admin/mid-mapping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mid-mapping'] })
  });
}
