# AGENTS.md

Implement the portal exactly as specified in `docs/Detailed_Technical_Design.md`.

Rules:
- Use TypeScript strict mode
- Validate external payloads with Zod
- Preserve department context end-to-end
- Keep demo mode available when live credentials are missing
- Do not remove partial payment or partial refund support
- Separate surcharge/service fee as its own line item in receipts and DMS posting payloads
- Make surcharge admin-controlled with enable/disable, percentage, refund policy, and display label settings
- Calculate surcharge only on the amount being paid now, never on the full RO balance
- Respect the configured `refund_surcharge` policy when processing partial refunds
- Demo mode must use the same surcharge rules so the prototype stays sign-off ready
- Support Cash, Credit, Debit, and Stored Token / Recurring payment methods
- Credit and stored token follow the credit-card surcharge policy; cash and debit do not surcharge
- Credit purchases may optionally create a token for future use, but raw PAN must never be stored or displayed
- Customer detail surfaces must show token-on-file status and token metadata only (token id/reference, last4, brand, default flag)
- Demo mode must include fake token-on-file and fake token-creation states for sign-off reviews
- Keep customer summary cards minimal; use a detail view for address, phone, vehicles, open ROs, and past service history
- Quick customer search should target customer name and customer ID only; advanced filters handle address, phone, and vehicle fields
- Multiple vehicles and multiple ROs per customer should be represented in the demo scaffold and schema sketch
- The Transactions tab is an RO list, not a generic payment ledger; use TanStack Table with filters and sorting
- Open ROs should be orange-highlighted and actionable; closed ROs should be green-highlighted and history-only
- Mixed RO default routing rule: use Service MID unless cashier explicitly overrides
- Manual Force Post must reattempt DMS write-back without re-charging the card
