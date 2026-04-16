# Car_Payment

Starter repository for a next-generation car payment portal.

## Included in this scaffold
- DMS line-item aware RO fetch
- Partial payment support
- Partial refund scaffold
- Demo mode for sales demos without live credentials
- Mixed-RO routing rule: default to Service MID, cashier may override before charge
- DMS sync exception reporting scaffold
- Manual Force Post reconciliation path
- Terminal heartbeat monitor scaffold
- Receipt preview with print, email, and text demo actions
- Explicit surcharge separation on receipt and DMS posting model

## Start here
- `docs/Detailed_Technical_Design.md`
- `specs/database/schema.sql`
- `src/api/app.ts`
- `src/frontend/router.tsx`
- `src/frontend/features/payments/PaymentStepperModal.tsx`

## Notes
This is a scaffold for Codex, not a production-complete app. Live partner integrations, persistence, auth, and deployment hardening still need implementation and verification.
