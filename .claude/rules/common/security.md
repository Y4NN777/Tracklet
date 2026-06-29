---
description: MISHKAN common security rules — apply to all files (Mishmar-owned)
alwaysApply: true
---

# Common Security Rules

Owned by Mishmar. Apply to all files. Security is a constraint shaping output
from the start, not an audit at the end.

- **No hardcoded secrets.** No passwords, tokens, API keys, or connection strings in source.
- **No `eval()`** or equivalent dynamic code execution from untrusted input.
- **No SQL string concatenation.** Parameterised queries always (asyncpg parameters, ORM bindings).
- **Input validation** on every API boundary — validate type, range, and shape before use.
- **Output encoding** for all user-facing content (prevent XSS, injection in rendered output).
- **Rate limiting** on all public API endpoints.
- **Session security middleware** always present on stateful services.
- **SOPS + age** for secret management. Never commit plaintext `.env` to version control.
- **Hardening overlay** re-applied on every container recreate — not optional, not one-time.
- **Keycloak SSO** as the identity source for any multi-service system.
