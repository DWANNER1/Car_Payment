# AGENTS.md

## Objective
Implement the Next-Gen Payment Portal exactly as specified in `docs/Detailed_Technical_Design.md`.

## Non-Negotiable Rules
- Use TypeScript strict mode.
- Validate all API payloads with Zod before network calls.
- Use TanStack Query for frontend async data flows.
- Do not store raw PAN or other sensitive card data.
- Store only gateway token, last4, and card brand.
- Enforce webhook idempotency.
- Enforce void-vs-refund cutoff server-side using `auto_batch_time`.
- Never trust the client clock for payment policy decisions.
- Do not alter the API contracts or the payment stepper state machine without approval.

## Target Stack
- React + Vite + MUI frontend
- Express or NestJS API
- PostgreSQL
- Redis
- Nginx
- PM2
- AWS Lightsail single-instance deployment

## Suggested First Sprint
1. Create base project structure from the design doc.
2. Add auth and RBAC route guards.
3. Build dashboard and transactions screens with mock data.
4. Stub DMS and iPOSpays clients.
5. Implement payment stepper steps 1-3.
6. Implement webhook endpoint with signature verification and idempotency.
7. Add admin settings UI and policy enforcement.

## Verification Before Live Use
- Confirm iPOSpays v3 endpoints, iframe origin, and signature algorithm.
- Confirm DMS payloads for `FETCH_RO` and `WRITE_BACK`.
- Confirm surcharge legality for each target state.
