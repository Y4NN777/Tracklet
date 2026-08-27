# ADR 0000 — Use Architecture Decision Records

- **Date:** 2026-06-29
- **Status:** Accepted

## Context

We need a consistent way to document architectural decisions for Tracklet.

## Decision

We use the Architecture Decision Record (ADR) format described by Michael
Nygard. Each ADR captures a decision, its context, the options considered,
and the outcome.

## Format

```markdown
# ADR NNNN — Title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Deprecated | Superseded

## Context

What is the issue motivating this decision?

## Decision

What is the change being made?

## Options Considered

What alternatives were evaluated?

## Consequences

What becomes easier or harder?
```

## Consequences

- Decisions are documented and reviewable.
- New team members can understand past trade-offs.
- ADRs are immutable once accepted (superseded by new ADRs, never edited).
