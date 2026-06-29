# Runbook: Threat Model Review (Mishmar)

**Team:** Mishmar (Security)

## When to Run

Before every major release. After any feature that changes data flow.

## Steps

1. Re-run STRIDE analysis against the current feature set.
2. Check all user text inputs for XSS vectors.
3. Verify no network requests are made.
4. Review export flow for data leakage risks.
5. Update THREAT_MODEL.md with any new findings.
