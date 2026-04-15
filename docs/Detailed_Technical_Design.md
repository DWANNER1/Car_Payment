# Detailed Technical Design Document: Next-Gen Payment Portal

**Status:** Ready for AI handoff  
**Deployment target:** Single AWS Lightsail instance (Ubuntu 22.04)

## 1. Goal

Build a car payment portal that orchestrates DMS repair-order lookup, card-present and card-on-file payments through iPOSpays, webhook-driven transaction reconciliation, and admin-controlled surcharge/refund policies.

## 2. High-Level Architecture

```text
Client Browser
└─ HTTPS (443) ─► Nginx (Reverse Proxy + SSL)
   ├─ /      → Serves React build (/dist)
   └─ /api/* → Proxies to localhost:3000 (Node.js)
               ├─ Express/NestJS API
               ├─ iPOSpays / DMS clients
               └─ PostgreSQL (localhost:5432)
```

### 2.1 Instance stack
- Ubuntu 22.04 LTS
- Nginx + Certbot for SSL termination
- Node.js 20+ with Express or NestJS, managed by PM2
- PostgreSQL 15
- Redis 7 for light queue/cache workloads
- Minimum suggested size: **Lightsail 4GB RAM / 2 vCPU**

### 2.2 Single-instance tuning
- `postgresql.conf`: `shared_buffers='1GB'`, `effective_cache_size='2GB'`, `work_mem='16MB'`
- `pm2 ecosystem.config.js`: `exec_mode: "cluster"`, `instances: max`, `autorestart: true`
- Use `systemd` for PostgreSQL and Redis
- Nginx should auto-restart on boot
- Daily backups with `pg_dump` plus Lightsail snapshots

## 3. Project Structure

```text
/src
  /api          # Express routers, controllers, services
  /db           # Prisma schema or raw SQL migrations
  /frontend     # React + Vite + MUI
    /components # Shared UI
    /features   # Screen modules (Dashboard, Transactions, etc.)
    /hooks      # usePaymentFlow, useTokenManager, useDmsLookup
    /store      # Zustand slices
  /config       # PM2, Nginx, systemd templates
  /tests        # Jest + Supertest
```

## 4. Application Structure and Navigation

### 4.1 App shell
- Persistent header
  - Universal Search for DMS RO/VIN lookup
  - Auth token status monitor for iPOSpays Bearer TTL
  - Notifications hub for webhook alerts, batch sync status, and terminal drops
- Sidebar navigation
  - `/dashboard`
  - `/transactions`
  - `/customers`
  - `/admin`
- Main content area
  - Payment Stepper modal with a strict four-step state machine

### 4.2 Route summary
| Route | Purpose | Key Components |
|---|---|---|
| `/dashboard` | Live KPIs and recent activity | `<KpiGrid>`, `<SystemHealth>`, `<RecentTransactions>` |
| `/transactions` | Historical ledger and reconciliation | `<DataGrid>`, export, retry post |
| `/customers` | Card-on-file and recurring billing | `<TokenList>`, `<AddCardModal>`, `<DefaultSelector>` |
| `/admin` | Policy and DMS configuration | `<SurchargeToggle>`, `<BatchTimePicker>`, `<DmsCredsForm>` |

### 4.3 Payment stepper state machine
`idle → validating → processing → success | error | declined`

## 5. External Integrations

### 5.1 DMS commands
| Command | Method | Endpoint Pattern | Notes |
|---|---|---|---|
| `FETCH_RO` | `GET` | `/repair-orders?search={query}` | Maps `totalAmountDue` to `amount_base`; returns `ro_number`, `vin`, `customer_name`, `status` |
| `WRITE_BACK` | `POST` | `/accounting/journal-entry` | Sends `authCode`, `finalAmount`, `gateway_tx_id`; triggers RO closure |

```ts
export interface DmsFetchResponse {
  ro_number: string;
  vin: string;
  customer_name: string;
  totalAmountDue: number;
  status: "open" | "closed";
}
```

### 5.2 iPOSpays v3 gateway commands
| Command | Method | Purpose | Key Payload / Notes |
|---|---|---|---|
| `AUTH_TOKEN` | `POST` | Get bearer token | `{ merchant_id, secret }` |
| `C2D_SALE` | `POST` | Ping terminal / terminal sale | `{ tpn, amount, external_id: ro_number }` |
| `FTD_TOKEN` | `POST` | Freedom-to-Design iframe handshake | Returns `paymentTokenId` for secure CoF |
| `RECURRING_SALE` | `POST` | Stored-card charge | `{ cardToken, amount, description }` |
| `VOID` | `POST` | Pre-batch reversal | Allowed before `auto_batch_time` |
| `REFUND` | `POST` | Post-batch return | Requires `refund_surcharge` policy toggle |

### 5.3 Webhook listener
- Endpoint: `POST /api/webhook/ipos`
- Responsibilities:
  - Validate signature
  - Enforce idempotency using a unique transaction constraint
  - Update transaction status in PostgreSQL
  - Invalidate frontend cache and refresh affected views

## 6. Business Logic and Admin Controls

### 6.1 Surcharge and refund policy
- Enforced server-side
- UI should show policy previews in Admin and Receipt screens
- Suggested admin controls:
  - `surcharge_pct` from `0.00` to `5.00`, default `3.00`
  - `refund_surcharge` boolean toggle
  - `auto_batch_time` time picker, default `02:00`
- Validation via Zod
- Super-admin role required for policy changes
- Secrets encrypted at rest

### 6.2 Batch cutoff: void vs refund
- If `current_time < auto_batch_time`: use `VOID`
- If `current_time >= auto_batch_time`: use `REFUND`
- Must be enforced server-side
- Never trust the client clock
- `organizations.auto_batch_time` is tenant-configurable

### 6.3 Tokenization workflow
- User opens `AddCardModal`
- Frontend loads the iPOSpays FTD iframe
- Iframe returns `paymentTokenId`
- Backend executes a `$0.00` pre-auth to validate the token
- Backend stores `card_token`, `last_four`, and `card_brand` in `customer_tokens`
- PCI rule: the portal must never touch raw PAN data

## 7. Database Schema

See `specs/database/schema.sql`.

## 8. Screen-by-Screen Implementation

### 8.1 Dashboard (`/dashboard`)
- Components: KPI grid, system health, recent transactions
- Data source: TanStack Query polling `/api/v1/metrics`
- Error handling: skeletons and retry toast on 5xx
- KPI click action routes to filtered `/transactions`

### 8.2 Transactions (`/transactions`)
- MUI `DataGrid` with server-side pagination, sorting, and filtering
- Columns: RO#, Customer, Method, Base, Surcharge, Total, Status, DMS Posted, Date, Actions
- Debounced search: 300 ms
- Max 1000 rows per fetch
- Actions: Export CSV, Retry DMS post, View receipt

### 8.3 Customers (`/customers`)
- Components: `<TokenListTable>`, `<AddCardModal>`
- Workflow: select/add card, complete FTD handshake, run `$0` pre-auth, save token, optionally mark as default
- Security: mask tokens except brand and last4; keep iframe sandboxed and PCI compliant

### 8.4 Admin (`/admin`)
- Tabs: Surcharge & Refund, Batch Schedule, DMS Credentials, Audit Log

### 8.5 Payment stepper modal
| Step | Component | API / Logic | Block Condition |
|---|---|---|---|
| 1. Confirm RO | `<ROLookupForm>` | `FETCH_RO` → validate `status=open` | RO closed/invalid |
| 2. Select Method | `<PaymentMethodSelector>` | Calculate `amount_total` using `surcharge_pct` | None |
| 3. Terminal / Token | `<TerminalPing>` or `<StoredCardSelector>` | `C2D_SALE` or `RECURRING_SALE` | TPN offline / token expired |
| 4. Finalize | `<ReceiptPreview>` | Webhook success → `WRITE_BACK` → `status=captured` | Timeout / declined |

## 9. Coding Agent Rules

- Use **TypeScript strict mode**
- Validate all external payloads with **Zod**
- Use **TanStack Query** for async frontend data flows
- Do not store PAN; store only token, last4, and brand
- Webhook handling must be idempotent
- Every mutation requires loading, error, and retry handling
- Keep architecture single-instance ready
- Do not alter API contracts or payment state machine without approval

## 10. First Sprint Deliverables

1. Nginx + PM2 + PostgreSQL setup script (`setup.sh`)
2. Auth + RBAC route guards (`super_admin`, `cashier`)
3. `/dashboard` + `/transactions` with mock data, ready for real API swap
4. Payment Stepper steps 1–3 with stubbed iPOSpays and DMS clients
5. Webhook endpoint with signature verification and idempotency
6. Admin settings UI with server-side policy enforcement

## 11. Pre-Code Verification Checklist

- Obtain iPOSpays v3 partner docs
- Confirm FTD iframe origin and webhook signature algorithm
- Obtain Fortellis/Cox API credentials
- Verify exact `FETCH_RO` and `WRITE_BACK` payloads
- Confirm surcharge legality by state and constrain admin ranges if needed
- Provision Lightsail instance and verify services restart on reboot

## 12. Codex Handoff Prompt

Implement exactly as specified in this repository. Use TypeScript strict mode, Zod validation, and TanStack Query. Do not alter API contracts, webhook semantics, or the payment stepper state machine without approval. Keep the implementation single-instance ready for AWS Lightsail using Nginx, PM2, PostgreSQL, and Redis.
