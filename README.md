# Car_Payment

Starter repository for a next-generation car payment portal.

## Included in this scaffold
- DMS line-item aware RO fetch
- Partial payment support
- Partial refund scaffold
- Demo mode for sales demos without live credentials
- MID mapping admin scaffold
- DMS sync exception reporting scaffold
- Terminal heartbeat monitor scaffold
- Receipt preview with print, email, and text demo actions
- Mixed-RO routing rule: default to Service MID, cashier may override before charge
- Force Post reconciliation path for failed DMS post scenarios
- Explicit surcharge separation on receipt and DMS posting model

## Start here
- `docs/Detailed_Technical_Design.md`
- `specs/database/schema.sql`
- `src/api/app.ts`
- `src/frontend/features/payments/PaymentStepperModal.tsx`
