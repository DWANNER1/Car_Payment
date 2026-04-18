import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BrandingConfig } from '../../shared/payment';
import { fetchJson } from '../lib/api';

export function useBrandingConfig() {
  return useQuery({
    queryKey: ['branding-config'],
    queryFn: () => fetchJson<BrandingConfig>('/api/admin/branding')
  });
}

export function useSetBrandingConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BrandingConfig) =>
      fetchJson<BrandingConfig>('/api/admin/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branding-config'] });
    }
  });
}
