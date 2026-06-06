# Xenysis Backend Context Summary

## Product

Xenysis is an AI Technical Cofounder platform.

The system helps founders move from idea validation to startup planning and execution through AI-generated artifacts.

Core flow:

Founder Session
→ Opportunity Assessment
→ Startup Blueprint
→ Workspace Graph
→ Preview
→ Deploy

---

## Architecture Style

Artifact-driven.

Each artifact is:

* Versioned
* Regeneratable
* Persisted
* Auditable

Artifacts are the source of truth.

---

## MVP Agents

### OpportunityAgent

Responsibilities:

* Market analysis
* Competition analysis
* Customer analysis
* Risk analysis
* Opportunity scoring

Output:

OpportunityAssessment

---

### BlueprintAgent

Responsibilities:

* Business model generation
* MVP definition
* Pricing strategy
* Product planning
* System planning

Output:

StartupBlueprint

---

### WorkspaceAgent

Responsibilities:

* Architecture visualization
* Node generation
* Connector generation
* Workspace layout

Output:

WorkspaceGraph

---

## Generation Flow

Founder Session
→ OpportunityAgent
→ OpportunityAssessment

OpportunityAssessment
→ BlueprintAgent
→ StartupBlueprint

StartupBlueprint
→ WorkspaceAgent
→ WorkspaceGraph

---

## Backend Stack

* Hono
* TypeScript
* Drizzle ORM
* PostgreSQL
* Supabase Auth
* Supabase Storage
* Railway
* Claude API

---

## Important Decisions

* No GraphQL
* No Microservices
* No Kubernetes
* No Event Sourcing
* No Workflow Engine

Use:

* REST
* SSE
* JSONB for artifacts
* Zod validation
* Idempotent generation jobs

---

## Current Development Phase

Sprint 1

Focus:

* Hono setup
* Drizzle schema
* Database migrations
* Supabase auth
* Auth middleware
* Health endpoint
* /auth/me endpoint

No AI generation yet.
