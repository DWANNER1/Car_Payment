import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export interface MidMapping {
  parts: string;
  service: string;
  sales: string;
  body_shop: string;
}

export function useMidMapping() {
  return useQuery({
    queryKey: ['mid-mapping'],
    queryFn: () => fetchJson<MidMapping>('/api/admin/mid-mapping')
  });
}

export function useSetMidMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<MidMapping>) =>
      fetchJson<MidMapping>('/api/admin/mid-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mid-mapping'] });
    }
  });
}
