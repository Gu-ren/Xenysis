# Xenysis Development Rules

## Source of Truth

The official architecture document is:

docs/architecture/XENYSIS_BACKEND_SPEC.md

All implementation decisions must follow that document unless an explicit architecture revision is approved.

---

## Core Architecture Principles

* Artifact-driven architecture
* Agent-oriented architecture
* Versioned artifacts
* Job-based AI generation
* MVP-first development
* Simplicity over abstraction

---

## Technology Stack

Backend:

* Hono
* TypeScript
* Drizzle ORM
* PostgreSQL (Supabase)

Authentication:

* Supabase Auth

Storage:

* Supabase Storage

AI:

* Anthropic Claude

Deployment:

* Railway

Communication:

* REST APIs
* Server Sent Events (SSE)

---

## Architecture Constraints

Do NOT introduce:

* GraphQL
* Microservices
* Kubernetes
* Event Sourcing
* CQRS
* LangGraph
* Temporal
* Workflow engines
* Message brokers
* Distributed systems patterns

Unless explicitly approved in an architecture revision.

---

## Artifact Model

Artifacts are the source of truth.

Current artifacts:

* Founder Session
* Opportunity Assessment
* Startup Blueprint
* Workspace Graph
* Preview Context

All artifacts:

* Must be versioned
* Must be auditable
* Must support regeneration
* Must be stored persistently

---

## Agent Architecture

MVP Agents:

* OpportunityAgent
* BlueprintAgent
* WorkspaceAgent

Rules:

* Agents own prompts
* Agents own validation
* Agents own artifact generation
* Agents own AI calls
* Agents own AI usage tracking

GenerationJobs orchestrate agents.

Artifacts remain the source of truth.

---

## Future Agents

Do not implement yet:

* ResearchAgent
* CriticAgent
* TechnicalArchitectAgent
* PreviewAgent

Architecture should allow future addition without redesign.

---

## Database Rules

* Use Drizzle ORM
* Use PostgreSQL
* Use JSONB only for artifact content
* Do not store queryable fields inside JSONB
* Use soft deletes
* Use migrations for all schema changes
* Use append-only artifact version tables

---

## Security Rules

* All routes require authentication unless explicitly public
* Enforce ownership using user_id
* Enable Supabase RLS
* Encrypt deployment secrets using AES-256-GCM
* Track AI usage and costs
* Rate limit generation endpoints

---

## AI Generation Rules

* Use Claude tool_use
* Do not rely on JSON mode
* Validate all outputs with Zod
* Retry invalid outputs
* Store prompt versions
* Store AI usage metrics
* Use idempotency keys

---

## Development Priorities

1. Correctness
2. Simplicity
3. Maintainability
4. Speed
5. Scalability

Never sacrifice simplicity for theoretical future scale.

---

## MVP Goal

Founder Session
→ Opportunity Assessment
→ Blueprint
→ Workspace

Ship the core loop before building advanced platform features.
