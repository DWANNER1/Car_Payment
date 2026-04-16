import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';
export function useTerminalHeartbeats(){ return useQuery({queryKey:['terminal-heartbeats'], queryFn:()=>fetchJson<Array<{terminalId:string;status:string;lastHeartbeatAt:string}>>('/api/admin/terminal-heartbeats')}); }
