import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';
export function useDemoMode(){ return useQuery({queryKey:['demo-mode'], queryFn:()=>fetchJson<{enabled:boolean}>('/api/admin/demo-mode')}); }
export function useSetDemoMode(){ const qc=useQueryClient(); return useMutation({mutationFn:(enabled:boolean)=>fetchJson<{enabled:boolean}>('/api/admin/demo-mode',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled})}), onSuccess:()=>qc.invalidateQueries({queryKey:['demo-mode']})}); }
