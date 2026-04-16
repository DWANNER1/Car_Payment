# Detailed Technical Design Document: Next-Gen Payment Portal

## Core PM rules

### 1. Mixed-RO Split-MID routing rule
If an RO contains both Parts and Service line items, the portal must default the routing MID to the **Primary Service MID**. The cashier may manually override the MID before pressing Charge.

### 2. Manual Reconciliation Tools
If a payment is captured at the gateway but failed to post to the DMS, the user must be able to re-attempt the `WRITE_BACK` command without re-charging the customer.

### 3. Surcharge disclosure and compliance
The receipt preview and final receipt must show the surcharge as a **separate line item**. The DMS write-back payload must model it as a **non-taxable miscellaneous fee**.

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
