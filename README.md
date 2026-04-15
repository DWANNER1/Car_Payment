# Car_Payment

Starter repository for a next-generation car payment portal.

## Purpose

This repo contains the technical design, API contracts, schema, starter code, and handoff notes needed for Codex or another coding agent to begin implementation.

## Start Here

- `docs/Detailed_Technical_Design.md` — primary implementation spec
- `AGENTS.md` — instructions for Codex / coding agents
- `.env.example` — local environment template
- `src/api/app.ts` — modular Express app assembly
- `src/api/routes/admin.ts` — demo-mode admin API
- `src/frontend/router.tsx` — app routing
- `src/frontend/features/payments/ReceiptPreviewCard.tsx` — printable/email/text receipt preview
- `src/frontend/features/payments/PaymentStepperModal.tsx` — demo-aware payment stepper
- `specs/database/schema.sql` — PostgreSQL schema
- `specs/contracts/ipos.ts` — iPOSpays request and webhook contracts
- `specs/business/refund-policy.ts` — refund/surcharge business logic
- `specs/ui/payment-stepper.csv` — payment stepper flow

## Local development

```bash
npm install
npm run dev
```

This starts:
- API workspace on port `3000`
- Frontend workspace on Vite default port

## Current scaffold includes

- root npm workspace
- shared payment/receipt types package scaffold
- Express API starter with modular routes, demo mode, client stubs, and in-memory transaction state
- Zod schemas for RO lookup, payment mutations, and webhook payloads
- webhook idempotency guard and starter Jest/Supertest coverage
- React + Vite frontend starter with MUI and React Router
- app shell, routed pages, payment stepper modal, receipt preview, and demo-mode admin toggle
- Nginx and PM2 deployment templates
- Lightsail setup script

## Demo mode

Demo mode can be toggled from the Admin page. When enabled, the app uses generated sample data and fake payment/DMS flows so the system can be demonstrated without live partner credentials.

## Notes

Before coding against live systems, validate all iPOSpays and DMS contract details against official partner documentation.
