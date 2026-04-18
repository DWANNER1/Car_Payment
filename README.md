# Car Payment Prototype Notes

This repository is a prototype scaffold for the Car Payment portal.

## Demo mode
- Demo mode is enabled by default.
- The app includes seeded repair orders, customers, transactions, terminal heartbeats, routing MIDs, receipt templates, branding, surcharge settings, and token-on-file demo states.

## Payment methods
- Cash
- Credit
- Debit
- Stored Token / Recurring

## Customer browsing
- Customer cards stay intentionally minimal.
- Click a customer to open the detail view with address, phone, token metadata, vehicles, past RO history, and open ROs.
- Quick search only searches customer name and customer ID.
- Use advanced filters for address, phone, and vehicle/VIN/license lookups.

## Transactions tab
- The Transactions tab is an RO list, not a generic payment ledger.
- It uses TanStack Table for sorting and filtering.
- Open ROs are shaded orange and are the actionable payment targets.
- Closed ROs are shaded green and remain visible for history/reference.
- Click an open RO row to begin payment for that specific RO.

## Token safety
- The prototype never stores or displays raw PAN.
- Only token metadata is shown or persisted in demo state:
  - token id/reference
  - last4
  - card brand
  - default flag

## Surcharge behavior
- Cash and debit do not surcharge.
- Credit and stored token follow the admin surcharge policy.
- Surcharge appears as a separate line item on the receipt and posts to DMS as a non-taxable miscellaneous fee.
