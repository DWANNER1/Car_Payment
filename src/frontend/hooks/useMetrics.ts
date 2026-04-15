import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export interface MetricsResponse {
  todaySales: number;
  pendingRos: number;
  activeTerminals: number;
  syncHealth: string;
}

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => fetchJson<MetricsResponse>('/api/v1/metrics')
  });
}
