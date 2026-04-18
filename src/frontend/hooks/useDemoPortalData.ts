import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';
import { prototypeSeed, type PrototypeData } from '../../shared/prototype';

export type { PrototypeData } from '../../shared/prototype';
export type DemoLineItem = PrototypeData['sampleRos'][number]['lineItems'][number];
export type DemoRo = PrototypeData['sampleRos'][number];
export type DemoCustomer = PrototypeData['sampleCustomers'][number];
export type DemoTransaction = PrototypeData['sampleTransactions'][number];
export type DemoPortalData = PrototypeData;

export function useDemoPortalData() {
  return useQuery({
    queryKey: ['demo-prototype-data'],
    queryFn: async () => {
      try {
        return await fetchJson<PrototypeData>('/api/demo/prototype');
      } catch {
        return prototypeSeed;
      }
    },
    initialData: prototypeSeed
  });
}
