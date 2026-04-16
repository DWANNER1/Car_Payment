# Car_Payment

Starter repository for a next-generation car payment portal.

## Purpose

This repo contains the technical design, API contracts, schema, starter code, and handoff notes needed for Codex or another coding agent to begin implementation.

## Start Here

- `docs/Detailed_Technical_Design.md` — primary implementation spec
- `AGENTS.md` — instructions for Codex / coding agents
- `src/api/app.ts` — modular Express app assembly
- `src/api/routes/admin.ts` — admin settings and demo-mode API
- `src/api/routes/metrics.ts` — dashboard metrics and sync exceptions scaffold
- `src/frontend/features/payments/ReceiptPreviewCard.tsx` — printable/email/text receipt preview
- `specs/database/schema.sql` — PostgreSQL schema

## Current scaffold includes

- demo mode with generated sample data
- receipt preview actions
- webhook idempotency starter
- payment/DMS client stubs
- admin controls including demo mode and MID mapping scaffold
- DMS sync exception report scaffold
- terminal heartbeat monitor scaffold
- department-aware transaction data model

## Notes

Before coding against live systems, validate all iPOSpays and DMS contract details against official partner documentation.
