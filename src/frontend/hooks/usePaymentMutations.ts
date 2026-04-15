import { useMutation } from '@tanstack/react-query';
import { fetchJson } from '../lib/api';

export interface TerminalSaleRequest {
  roNumber: string;
  tpn: string;
  amount: number;
}

export interface TokenSaleRequest {
  roNumber: string;
  cardToken: string;
  amount: number;
  description: string;
}

export interface FinalizePaymentRequest {
  roNumber: string;
  authCode: string;
  finalAmount: number;
  gatewayTransactionId: string;
}

export function useCreateTerminalSale() {
  return useMutation({
    mutationFn: (payload: TerminalSaleRequest) =>
      fetchJson<{ transactionId: string; status: string }>('/api/payments/terminal-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
  });
}

export function useCreateTokenSale() {
  return useMutation({
    mutationFn: (payload: TokenSaleRequest) =>
      fetchJson<{ transactionId: string; status: string }>('/api/payments/token-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
  });
}

export function useFinalizePayment() {
  return useMutation({
    mutationFn: (payload: FinalizePaymentRequest) =>
      fetchJson<{ ok: true }>('/api/payments/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
  });
}
