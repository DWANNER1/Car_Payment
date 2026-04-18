# Detailed Technical Design Document: Next-Gen Payment Portal

## Core PM rules

### 1. Mixed-RO Split-MID routing rule
If an RO contains both Parts and Service line items, the portal must default the routing MID to the **Primary Service MID**. The cashier may manually override the MID before pressing Charge.

### 2. Manual Reconciliation Tools
If a payment is captured at the gateway but failed to post to the DMS, the user must be able to re-attempt the `WRITE_BACK` command without re-charging the customer.

### 3. Surcharge disclosure and compliance
The surcharge is admin-controlled and must be configurable as:
- enabled/disabled
- surcharge percentage
- refund surcharge policy
- display label, defaulting to `Service Fee`

The receipt preview and final receipt must show the surcharge as a **separate line item**. The DMS write-back payload must model it as a **non-taxable miscellaneous fee**.

Implementation rules:
- Surcharge is calculated only on the amount being paid now, not the full RO balance.
- Surcharge does not inflate Parts or Service revenue totals.
- Surcharge behavior must work in demo mode when no live credentials are available.
- Refund handling must respect the configured `refund_surcharge` policy.

### 4. DMS fetch logic
`FETCH_RO` returns header plus line-items array. Each line item includes `line_id`, `description`, `department_id`, `department_name`, `amount`, and `category`.

### 5. Partial payment support
The user may apply a partial payment less than the remaining balance. The RO remains open until fully settled.

### 6. Partial refund support
Managers may refund a specific dollar amount without reversing the entire invoice.

### 7. Reporting
Add a DMS Sync Exception Report and a Force Post action.

### 8. Hardware operations
Show terminal heartbeat status as online/offline/unknown in the UI.

### 9. Payment methods and token rules
The portal must support `Cash`, `Credit`, `Debit`, and `Stored Token / Recurring` payment methods.

Surcharge rules by method:
- Cash: no surcharge
- Debit: no surcharge
- Credit: surcharge may apply if enabled in admin
- Stored token / recurring: treated as the credit-card path unless business rules override it

Token workflow:
- Credit purchase can optionally create and store a token for future use
- Stored token payment must use the token on file without re-entering card details
- Customer detail views must show token-on-file status, token summary, last4, brand, and default token flag
- Never display or store raw PAN in the prototype

Demo mode:
- Demo mode must include fake token-on-file states and fake token creation behavior so the prototype can be signed off before any live API credentials are provided

### 10. Customer summary and detail behavior
The customer list must stay simple:
- Customer card shows only high-value summary information
- Quick search uses only customer name and customer ID
- Advanced filters handle address, phone, and vehicle/VIN/license lookups

The customer detail view must show:
- customer identifiers
- address
- phone
- token-on-file status
- token metadata only
- vehicles owned
- open RO list
- past RO / service history

Open RO flow:
- If a customer has multiple open ROs, show them all in the detail view
- The user clicks the specific RO itself to start payment
- Stored token remains available in the payment flow when the customer has a token on file

Data model note:
- The prototype seed and SQL sketch assume a one-to-many customer model with multiple vehicles and multiple ROs per customer, even though the app is still demo-backed rather than fully persistence-backed

### 11. Transactions tab
The Transactions tab is an RO worklist, not a generic payment ledger.

Implementation rules:
- Use TanStack Table for the RO list
- Support filtering and sorting so users can quickly find the RO they want to process
- Provide practical filters for status, customer name, RO number, department, and date when the date is modeled
- Open ROs should be highlighted with orange shading and should be the actionable payment targets
- Closed ROs should be highlighted with green shading and remain visible for history/reference
- Clicking an open RO should launch payment directly for that specific RO
- Closed ROs must not be presented as active payment targets
