---
description: Yasad (Backend) rules — load on backend files
globs: ["**/*.py", "**/*.pyi", "**/*.ts", "**/*.go", "**/*.rs", "**/*.java", "**/*.kt", "**/*.sql", "**/*.prisma", "**/*.proto", "**/*.graphql", "**/api/**", "**/migrations/**", "**/alembic/**", "**/models/**", "**/schemas/**", "**/services/**", "**/repositories/**", "**/routers/**", "**/handlers/**", "**/middleware/**", "**/tests/**", "**/conftest.py", "**/pyproject.toml", "**/poetry.lock", "**/uv.lock", "**/requirements*.txt", "**/go.mod", "**/go.sum", "**/Cargo.toml", "**/Cargo.lock", "**/openapi*.{yaml,yml,json}", "**/asyncapi*.{yaml,yml,json}"]
alwaysApply: false
---

# Yasad — Backend Rules

Load only on `.py`/`.ts`/`.go`/`.rs`/`api/**`. Owned by Zerubbabel (Team Lead).

- **OpenAPI 3.1 contract defined before any endpoint implementation.**
- **FastAPI (primary Python):** Pydantic v2 models for all request/response. Lifespan for startup/shutdown. asyncpg for PostgreSQL. Dependency injection for shared resources.
- **No raw SQL string formatting.** asyncpg parameters always.
- **Alembic for all schema migrations.** No manual `ALTER TABLE`.
- **Repository pattern** for data access — no ORM calls in route handlers.
- **LangGraph for stateful AI workflows** — not raw LangChain chains.
- **pydantic-settings** for environment config — not `os.environ` directly.
- **Hono (TS):** typed routes, Zod validation on all inputs.
- **NestJS (TS):** modules, providers, guards pattern — no God controllers.
- **Fastify (TS):** schema-validated routes.
- Alternate backends: Go, Rust, PHP/Laravel (working level).
- AI/ML layer: LangChain, LangGraph, HuggingFace Hub, OpenRouter, ChromaDB, sentence-transformers.
- Databases: PostgreSQL primary (indexing, query planning, extensions); MongoDB, DynamoDB also in use.
