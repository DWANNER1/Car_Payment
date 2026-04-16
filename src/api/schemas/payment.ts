import { z } from 'zod';
export const terminalSaleSchema = z.object({ roNumber:z.string().min(1), tpn:z.string().min(3), amount:z.number().positive(), departmentId:z.string().optional(), routingMid:z.string().optional() });
export const tokenSaleSchema = z.object({ roNumber:z.string().min(1), cardToken:z.string().min(6), amount:z.number().positive(), description:z.string().min(1), departmentId:z.string().optional(), routingMid:z.string().optional() });
export const finalizePaymentSchema = z.object({ roNumber:z.string().min(1), authCode:z.string().min(1), finalAmount:z.number().positive(), gatewayTransactionId:z.string().min(1), surchargeAmount:z.number().nonnegative().default(0) });
export const partialRefundSchema = z.object({ gatewayTransactionId:z.string().min(1), refundAmount:z.number().positive(), reason:z.string().min(1) });
export const forcePostSchema = z.object({ gatewayTransactionId:z.string().min(1) });
