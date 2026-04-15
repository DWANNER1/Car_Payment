import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export interface HealthResponse {
  ok: boolean;
  service: string;
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => fetchJson<HealthResponse>('/api/health')
  });
}
