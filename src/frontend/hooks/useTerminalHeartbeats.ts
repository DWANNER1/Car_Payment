import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export interface TerminalHeartbeat {
  terminalId: string;
  status: string;
  lastHeartbeatAt: string;
}

export function useTerminalHeartbeats() {
  return useQuery({
    queryKey: ['terminal-heartbeats'],
    queryFn: () => fetchJson<TerminalHeartbeat[]>('/api/admin/terminal-heartbeats')
  });
}
