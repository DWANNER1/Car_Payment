# Detailed Technical Design Document: Next-Gen Payment Portal

**Status:** Ready for AI handoff  
**Deployment target:** Single AWS Lightsail instance (Ubuntu 22.04)

## 1. Goal

Build a car payment portal that orchestrates DMS repair-order lookup, line-item aware payment decisions, card-present and card-on-file payments through iPOSpays, webhook-driven transaction reconciliation, and admin-controlled surcharge/refund/demo policies.

## 2. High-Level Architecture

```text
Client Browser
└─ HTTPS (443) ─► Nginx (Reverse Proxy + SSL)
   ├─ /      → Serves React build (/dist)
   └─ /api/* → Proxies to localhost:3000 (Node.js)
               ├─ Express/NestJS API
               ├─ iPOSpays / DMS clients
               ├─ Demo mode service + terminal heartbeat monitor
               └─ PostgreSQL (localhost:5432)
```

## 3. Key Functional Changes

### 3.1 DMS Fetch Logic
- `FETCH_RO` now returns a **line-item array**, not just a single total.
- Each line item should include:
  - `line_id`
  - `description`
  - `department_id`
  - `department_name`
  - `amount`
  - `category` (`parts`, `service`, `body_shop`, etc.)
- UI impact:
  - Parts vs Service breakdown
  - Department-aware reporting
  - MID routing by department

### 3.2 Payment Logic
- Add **partial payment** support.
- A user can pay less than the full RO balance.
- DMS remains `open` until the cumulative paid amount satisfies closure rules.
- Receipt preview must show:
  - original balance
  - payment amount applied now
  - remaining balance

### 3.3 Reversal Logic
- Add **partial refund** support.
- Managers can refund a fixed dollar amount without reversing the full invoice.
- Refund records must preserve department context and original gateway reference.

### 3.4 Admin Settings
- Add **Merchant ID (MID) mapping**.
- Admin can configure routing for:
  - Parts payments
  - Service payments
  - Body Shop payments
- Example use:
  - `department_id = parts` → MID A
  - `department_id = service` → MID B

### 3.5 Reporting
- Add **DMS Sync Exception Report**.
- This report shows payments that failed to post to the car system.
- Required fields:
  - RO number
  - gateway transaction ID
  - department
  - amount
  - failure reason
  - retry status
  - timestamp

### 3.6 Hardware Ops
- Add **Terminal Heartbeat Monitor**.
- Show terminal `Online` / `Offline` / `Unknown` in UI.
- Track last heartbeat timestamp per terminal.

## 4. External Integrations

### 4.1 DMS commands
| Command | Method | Endpoint Pattern | Notes |
|---|---|---|---|
| `FETCH_RO` | `GET` | `/repair-orders?search={query}` | Returns header plus line-items array |
| `WRITE_BACK` | `POST` | `/accounting/journal-entry` | Supports partial and final settlement posting |

Example DMS fetch shape:

```ts
export interface DmsFetchResponse {
  ro_number: string;
  vin: string;
  customer_name: string;
  status: 'open' | 'closed';
  totalAmountDue: number;
  remainingBalance: number;
  line_items: Array<{
    line_id: string;
    description: string;
    department_id: string;
    department_name: string;
    amount: number;
    category: 'parts' | 'service' | 'body_shop' | 'other';
  }>;
}
```

## 5. Business Logic

### 5.1 Partial payment
- User may enter a custom payment amount up to remaining balance.
- DMS write-back should indicate partial settlement when applicable.

### 5.2 Partial refund
- Manager may refund a fixed amount less than or equal to previously captured amount.
- Refund UI and API should accept explicit amount values.

### 5.3 MID mapping
- Payment routing should use department-aware MID selection.
- When multiple departments exist on one RO, either:
  - split by line-item department, or
  - require explicit user-selected payment scope.
- This starter repo models the config and routing target, but does not yet implement settlement splitting logic.

### 5.4 Terminal heartbeat
- Backend stores latest heartbeat status per terminal.
- Dashboard/Admin should surface heartbeat status for demos and operations.

## 6. Database Requirements

Transactions now require:
- `department_id`
- `line_items` JSONB
- partial payment/refund reference fields

See `specs/database/schema.sql`.

## 7. UI Requirements

### 7.1 Payment stepper
- Show line-item breakdown from DMS
- Support custom payment amount
- Support MID-aware routing preview
- Receipt preview shows payment amount and remaining balance

### 7.2 Admin
- Demo mode toggle
- MID mapping editor
- Terminal monitor
- Sync exception view

### 7.3 Reporting
- DMS Sync Exception Report page or panel for accounting operations

## 8. Coding Agent Rules

- Use TypeScript strict mode
- Validate all external payloads with Zod
- Preserve department context end-to-end
- Do not remove partial payment/refund support
- Keep demo mode available even when live credentials are missing
