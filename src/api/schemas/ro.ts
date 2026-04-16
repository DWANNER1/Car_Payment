import { z } from 'zod';
export const roQuerySchema = z.object({ query: z.string().min(1) });
export const dmsLineItemSchema = z.object({ line_id:z.string(), description:z.string(), department_id:z.string(), department_name:z.string(), amount:z.number(), category:z.enum(['parts','service','body_shop','other']) });
export const dmsRoSchema = z.object({ ro_number:z.string(), vin:z.string(), customer_name:z.string(), totalAmountDue:z.number(), remainingBalance:z.number(), status:z.enum(['open','closed']), line_items:z.array(dmsLineItemSchema) });
