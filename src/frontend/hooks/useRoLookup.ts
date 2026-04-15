import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export interface RepairOrder {
  ro_number: string;
  vin: string;
  customer_name: string;
  totalAmountDue: number;
  status: 'open' | 'closed';
}

export function useRoLookup(query: string) {
  return useQuery({
    queryKey: ['ro', query],
    queryFn: () => fetchJson<RepairOrder[]>(`/api/dms/ro?query=${encodeURIComponent(query)}`),
    enabled: query.trim().length > 0
  });
}
