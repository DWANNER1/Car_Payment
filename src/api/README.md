# API Layer

This folder is reserved for Express or NestJS routers, controllers, services, middleware, and external partner clients.

Suggested layout:

- `routes/`
- `controllers/`
- `services/`
- `clients/`
- `middleware/`
- `schemas/`

Key responsibilities:
- DMS RO lookup and write-back
- iPOSpays auth, terminal sale, tokenization, void, refund
- webhook validation and idempotency
- policy enforcement for surcharge and batch cutoff
- demo mode switching and sample-data generation
