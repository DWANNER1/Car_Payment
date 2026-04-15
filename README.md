# Car_Payment

Starter repository for a next-generation car payment portal.

## Purpose

This repo contains the technical design, API contracts, schema, starter code, and handoff notes needed for Codex or another coding agent to begin implementation.

## Start Here

- `docs/Detailed_Technical_Design.md` — primary implementation spec
- `AGENTS.md` — instructions for Codex / coding agents
- `.env.example` — local environment template
- `src/api/app.ts` — modular Express app assembly
- `src/frontend/App.tsx` — starter MUI app shell
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
- Express API starter with modular routes
- Zod schemas for RO lookup and webhook payloads
- policy helper functions and starter Jest tests
- React + Vite frontend starter
- MUI app shell and starter feature pages
- Nginx and PM2 deployment templates
- Lightsail setup script

## Notes

Before coding against live systems, validate all iPOSpays and DMS contract details against official partner documentation.
