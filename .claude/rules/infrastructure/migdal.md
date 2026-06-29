---
description: Migdal (Infrastructure) rules — load on infra files
globs: ["**/Dockerfile*", "**/*.dockerfile", "**/.dockerignore", "**/docker-compose*", "**/compose*.y*ml", "**/*.tf", "**/*.tfvars", "**/*.hcl", "**/*.yaml", "**/*.yml", "**/*.sh", "**/*.bash", "**/*.conf", "**/*.cnf", "**/*.ini", "**/*.toml", "**/*.service", "**/*.timer", "**/*.tpl", "**/Makefile", "**/Justfile", "**/Caddyfile", "**/.gitlab-ci.yml", "**/.gitlab/**", "**/infra/**", "**/deploy/**", "**/ops/**", "**/ansible/**", "**/playbooks/**", "**/helm/**", "**/charts/**", "**/k8s/**", "**/kustomize/**", "**/kustomization*", "**/.github/workflows/**", "**/nginx*", "**/traefik*", "**/prometheus*", "**/grafana/**"]
alwaysApply: false
---

# Migdal — Infrastructure Rules

Load only on `Dockerfile`/`docker-compose*`/`*.tf`/`*.yaml`/`infra/**`. Owned by Eliashib (Team Lead).

- **No `:latest` tags.** Pin all image versions.
- **All resources tagged** with environment, owner, project.
- **Least privilege** — no root processes in containers unless strictly required.
- **Hardening overlay always applied** — not optional on recreate.
- **Hash-based drift detection** on docker-compose changes (sha256 diff triggers recreate).
- **SOPS-encrypted secrets** — no plaintext `.env` files committed.
- **Traefik as reverse proxy** — nginx as static/fallback only.
- **GitLab CI:** environment scoping on all jobs. Protected branches gate production deploys. Runner-to-runtime SSH patterns documented.
- **Health checks on every service.** Idempotent recreate logic.
- **Ansible for configuration management** — no manual server config.
- Orchestration: Docker Compose primary; Kubernetes where scale requires. Terraform for declarative IaC. AWS + GCP.
- Observability: Prometheus, Grafana, Loki, Sentry, GlitchTip. OpenTelemetry for instrumentation.
