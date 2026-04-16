# AGENTS.md

Implement the portal exactly as specified in `docs/Detailed_Technical_Design.md`.

Rules:
- Use TypeScript strict mode
- Validate external payloads with Zod
- Preserve department context end-to-end
- Keep demo mode available when live credentials are missing
- Do not remove partial payment or partial refund support
- Separate surcharge/service fee as its own line item in receipts and DMS posting payloads
- Mixed RO default routing rule: use Service MID unless cashier explicitly overrides
- Manual Force Post must reattempt DMS write-back without re-charging the card
