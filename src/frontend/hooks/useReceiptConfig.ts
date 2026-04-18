import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReceiptTemplateConfig } from '../../shared/payment';
import { fetchJson } from '../lib/api';

export function useReceiptConfig() {
  return useQuery({
    queryKey: ['receipt-config'],
    queryFn: () => fetchJson<ReceiptTemplateConfig>('/api/admin/receipt-config')
  });
}

export function useSetReceiptConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReceiptTemplateConfig) =>
      fetchJson<ReceiptTemplateConfig>('/api/admin/receipt-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipt-config'] });
    }
  });
}
