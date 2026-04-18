import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export function useForcePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gatewayTransactionId: string) =>
      fetchJson<{ ok: boolean; forced: boolean }>('/api/admin/force-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gatewayTransactionId })
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['demo-prototype-data'] });
    }
  });
}
