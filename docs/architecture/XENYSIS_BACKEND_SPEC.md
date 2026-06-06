# Xenysis Backend Specification

**Version:** 1.0  
**Status:** Final  
**Date:** 2026-06-05  
**Scope:** MVP through first production release

This document is the official source of truth for all Xenysis backend development.
All implementation work must conform to the decisions recorded here.
Deviations require an explicit architecture revision — not a code-level workaround.

---

## Executive Summary

### Product Overview

Xenysis is an AI Technical Cofounder platform. It transforms a raw startup idea into a fully structured, actionable startup foundation through a guided sequence of AI-driven generation steps. Each step produces a versioned artifact that the user can inspect, refine, and regenerate independently.

### Core User Journey

```
Founder Session
      │  User describes their idea through an AI-guided conversation.
      │  Answers are captured as structured data.
      ↓
Opportunity Assessment
      │  AI analyzes market size, customer segments, competition, risks,
      │  and scores the opportunity.
      ↓
Startup Blueprint
      │  AI designs the business model, MVP scope, pricing strategy,
      │  and system architecture plan.
      ↓
Workspace Generation
      │  AI builds an interactive architecture graph: pages, databases,
      │  services, workflows, and integrations.
      ↓
Preview
      │  User navigates a simulated version of their startup UI.
      ↓
Deploy
      User configures and deploys their startup to production.
```

Each arrow in this journey is a distinct, independently retriggerable AI generation job. Users can regenerate any artifact at any time without affecting others.

### MVP Goals

1. Replace every frontend mock with a real, persistent backend
2. AI generation is reliable, validated, and produces schema-conformant artifacts
3. Every artifact is independently versioned — no generation overwrites previous work
4. AI token usage and cost are tracked per user and per startup from day one
5. The system is secure by default: ownership enforced at every query

### Architecture Philosophy

The backend is **artifact-driven** and **agent-oriented**. AI logic lives inside agents. Artifacts are the source of truth. Generation jobs orchestrate agent execution. The API exposes artifacts — not agent internals.

This architecture is designed to grow: new agents can be added, artifact schemas can version independently, and generation pipelines can be extended — all without rewriting the core system.

---

## Architectural Principles

### Artifact-Driven Architecture

Every meaningful output of the AI system is an **artifact**: a named, versioned, persistable document with a strict TypeScript type and Zod validation schema.

**Artifacts are:**
- **Independently generated** — each artifact has its own inputs and its own agent
- **Independently versioned** — regenerating creates a new version row; previous versions are never overwritten or deleted
- **Independently consumable** — the frontend fetches artifacts directly from the API; no runtime derivation
- **The source of truth** — agents write artifacts; everything else reads them

The four artifacts at MVP:
- `OpportunityAssessment`
- `StartupBlueprint`
- `WorkspaceGraph`
- `PreviewContext`

### Agent-Oriented Architecture

AI logic is encapsulated inside agents. An agent is a self-contained backend module that owns the complete lifecycle of one artifact type:

- Prompt construction and versioning
- AI provider invocation (Anthropic or OpenAI, per agent)
- Structured output validation (Zod)
- Artifact persistence (DB write)
- AI usage tracking (`ai_usage_log`)
- Activity logging (`activity_log`)

**Agents do not own:**
- HTTP routing
- GenerationJob state transitions
- SSE connection management

The `AgentRunner` owns job orchestration. Route handlers invoke the runner. Agents are pure generation modules — they can be tested in isolation without an HTTP server.

**Extensibility rule:** New agents are new modules. Adding a `ResearchAgent` in the future means creating `src/agents/research-agent/`. It does not require changes to existing agents, the `generation_jobs` table, or any API endpoint contract.

**Sub-agent rule:** When a future agent (e.g., `ResearchAgent`) becomes an internal dependency of `OpportunityAgent`, it is a private implementation detail of that agent. It writes to `ai_usage_log` but does not create `generation_jobs` rows.

### Versioning Strategy

Every artifact uses an **append-only version table** with an `is_current` boolean:

```
blueprints                       (parent — one per startup)
  └── blueprint_versions         (append-only — one row per generation)
        ├── is_current = false   (all previous versions)
        └── is_current = true    (exactly one — enforced by partial unique index)
```

**Partial unique index on each version table:**
```sql
CREATE UNIQUE INDEX ON blueprint_versions (blueprint_id) WHERE is_current = TRUE;
```

**Setting a new current version** always happens in a transaction:
```sql
UPDATE blueprint_versions SET is_current = FALSE WHERE blueprint_id = $1;
INSERT INTO blueprint_versions (..., is_current = TRUE);
```

There is no `current_version_id` pointer on parent tables. This avoids circular foreign keys and makes migration straightforward.

### Security Principles

- All API routes require a valid Supabase JWT
- Ownership is enforced at the query level: every query filters by `user_id = ctx.var.user.id`
- Supabase Row Level Security is enabled on all tables as a defence-in-depth layer
- Environment variable values are encrypted at rest with AES-256-GCM before storage
- `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, and `OPENAI_API_KEY` are server-side only — never in `NEXT_PUBLIC_*` environment variables
- AI generation endpoints are rate-limited via database count queries (no Redis required at MVP)

### Scalability Principles

- Supabase Transaction mode connection pooler is used from day one — not direct connections
- `generation_jobs` is designed for future BullMQ migration: moving to a queue requires no schema changes
- Agents are stateless modules — they can be extracted to separate services without contract changes
- `startup_health` is a computed SQL view, not a table — no sync problem, no stale data
- JSONB is used for artifact content (documents that evolve with prompts); normalized columns for anything that is filtered, sorted, or joined

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 22 (ESM) |
| Framework | Hono | Latest stable |
| ORM | Drizzle ORM | Latest stable |
| Database | Supabase PostgreSQL | Managed |
| Auth | Supabase Auth | Managed |
| AI (Anthropic) | Anthropic Claude | Sonnet 4.6 |
| AI (OpenAI) | OpenAI | GPT-4o |
| Storage | Supabase Storage | Managed |
| Deployment | Railway | Managed |

### Rationale

**Node.js 22 (ESM)**
Ecosystem alignment with the Next.js 15 frontend. Native ESM eliminates CommonJS interop complexity. LTS lifecycle provides stability.

**Hono**
Lightweight, TypeScript-native, edge-compatible HTTP framework. Zero runtime magic. Excellent middleware composability. Faster cold-start than Express or Fastify. If generation workers are ever extracted to Cloudflare Workers, Hono ports without a rewrite.

**Drizzle ORM**
Type-safe SQL-first query builder. No hidden N+1 traps. Full PostgreSQL feature support including JSONB, partial indexes, and views. Migration files are plain SQL committed to git — reviewable and reversible. The trade-off versus Prisma (less mature CLI) is accepted in exchange for SQL transparency.

**Supabase PostgreSQL**
Co-located with Auth and Storage on a single bill. pgvector is available for future semantic search without infrastructure changes. Free tier accommodates early users. Transaction mode pooler handles connection limits under load.

**Supabase Auth**
The frontend is already stubbed for Supabase Auth. JWT tokens are issued by Supabase and verified server-side. Email confirmation, OAuth providers, and session refresh are handled by the Auth service — not application code.

**AI Provider Strategy**
Two providers are used with distinct ownership boundaries. See [AI Provider Strategy](#ai-provider-strategy) for the full allocation table.

**Anthropic Claude Sonnet 4.6**
Used for `BlueprintAgent` and `WorkspaceAgent`. Best-in-class structured output reliability via the `tool_use` API. The `tool_use` + `tool_choice: { type: "tool", name: "..." }` pattern forces schema-conformant output, unlike JSON mode which permits prose contamination. Streaming via SSE is native to the API. The model ID is recorded on every `generation_jobs` row for cost attribution and model migration auditing.

**OpenAI GPT-4o**
Used for `OpportunityAgent` and all Founder Session interactions (conversation turns, dynamic follow-up questions, Opportunity Assessment generation, Founder Decision Report generation). Structured output is enforced via the `response_format: { type: "json_schema", ... }` parameter. The `tool_use` pattern is not used for OpenAI calls — JSON schema mode is sufficient and avoids unnecessary function-call framing. Streaming is handled via the OpenAI streaming API and forwarded over SSE using the same `GenerationEvent` envelope.

**Supabase Storage**
Co-located with the database. Signed URL generation for private assets. `startup-assets` bucket for generated exports and uploaded files.

**Railway**
Dockerfile-based deployment with automatic TLS, environment variable management, and GitHub integration. Starts at $5/month. No Kubernetes overhead. Horizontally scalable when needed. Railway is explicitly chosen over Vercel for the API because Vercel Edge Function timeout limits (25s Hobby / 60s Pro) would block long-running SSE generation streams.

**Not used:**
- GraphQL — REST + SSE is sufficient; GraphQL adds schema registry and subscription complexity for no benefit at this data shape
- Redis — DB count queries handle rate limiting; Postgres handles job state; add Upstash Redis only if a queue is needed
- WebSockets — SSE is unidirectional and sufficient for generation streaming
- Microservices, Kubernetes, ECS — out of scope until revenue-driven scaling demands it

---

## AI Provider Strategy

Two AI providers are used with explicit, non-overlapping ownership boundaries. Neither provider is a fallback for the other.

### Provider Allocation

| Feature / Agent | Provider | Model | Invocation Pattern |
|---|---|---|---|
| Founder Session conversation turns | OpenAI | GPT-4o | Chat completions (streaming) |
| Dynamic follow-up question generation | OpenAI | GPT-4o | Chat completions |
| Opportunity Assessment generation (`OpportunityAgent`) | OpenAI | GPT-4o | Chat completions + JSON schema mode |
| Founder Decision Report generation | OpenAI | GPT-4o | Chat completions + JSON schema mode |
| Startup Blueprint generation (`BlueprintAgent`) | Anthropic Claude | Sonnet 4.6 | `tool_use` + `tool_choice` |
| Workspace Graph generation (`WorkspaceAgent`) | Anthropic Claude | Sonnet 4.6 | `tool_use` + `tool_choice` |
| Technical planning artifacts | Anthropic Claude | Sonnet 4.6 | `tool_use` + `tool_choice` |
| Long-form startup generation outputs | Anthropic Claude | Sonnet 4.6 | `tool_use` + `tool_choice` |

### Agent Ownership Summary

| Agent | Provider |
|---|---|
| `OpportunityAgent` | OpenAI |
| `BlueprintAgent` | Anthropic Claude |
| `WorkspaceAgent` | Anthropic Claude |

### Rationale for the Split

**OpenAI for OpportunityAgent and Founder Session interactions**
Founder Session conversations and the Opportunity Assessment are dialogue-heavy, iterative, and benefit from GPT-4o's instruction-following in multi-turn chat contexts. JSON schema mode (`response_format: { type: "json_schema" }`) enforces structured output without the overhead of the tool-call protocol.

**Anthropic Claude for BlueprintAgent and WorkspaceAgent**
Blueprint and Workspace generation produce large, deeply nested structured artifacts. The `tool_use` + `tool_choice: { type: "tool", name: "..." }` pattern forces exact schema adherence — Claude refuses to return anything outside the declared schema. This is the highest-reliability pattern available for complex artifact generation.

### Structured Output Patterns

**OpenAI — JSON schema mode**
```typescript
const response = await openai.chat.completions.create({
  model:           'gpt-4o',
  response_format: { type: 'json_schema', json_schema: { name: 'OpportunityAssessment', schema: OpportunityAssessmentJsonSchema, strict: true } },
  messages,
  stream:          true,
})
```

**Anthropic — tool_use mode**
```typescript
const response = await anthropic.messages.create({
  model:       'claude-sonnet-4-6',
  tools:       [{ name: 'generate_blueprint', input_schema: StartupBlueprintJsonSchema }],
  tool_choice: { type: 'tool', name: 'generate_blueprint' },
  messages,
  stream:      true,
})
```

### Environment Variables

| Variable | Provider | Usage |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI | `OpportunityAgent`, Founder Session routes |
| `ANTHROPIC_API_KEY` | Anthropic | `BlueprintAgent`, `WorkspaceAgent` |

Both keys are server-side only — never in `NEXT_PUBLIC_*` variables.

---

## Domain Model

### Entity Map

```
profiles
  └── owns → startups (via user_id)

startups                          ← Aggregate root
  ├── has one  → founder_sessions (latest)
  ├── has one  → opportunity_assessments
  ├── has one  → blueprints
  ├── has one  → workspace_graphs
  ├── has one  → preview_contexts
  ├── has many → generation_jobs
  ├── has many → deploy_environments
  └── has many → activity_log (filtered by startup_id)

founder_sessions
  └── has many → session_answers

opportunity_assessments
  └── has many → opportunity_assessment_versions

blueprints
  └── has many → blueprint_versions

workspace_graphs
  ├── has many → workspace_graph_versions
  └── has many → workspace_asset_configs

preview_contexts
  (no versions — replaced when workspace changes)

generation_jobs
  ├── self-references → parent_job_id (child jobs)
  └── has many → ai_usage_log

deploy_environments
  ├── has many → deploy_env_vars
  └── has many → releases

activity_log
ai_usage_log
```

### Entity Reference

| Entity | Purpose | Ownership | Lifecycle |
|---|---|---|---|
| `profiles` | Display name, avatar URL, onboarding state — user metadata beyond Supabase Auth. | User | Created on first sign-in. Updated by user. Never deleted. |
| `startups` | Aggregate root. Groups all artifacts for one startup project. | User | Created when a founder session begins. Soft-deleted by user. Never hard-deleted. |
| `founder_sessions` | Captures the startup idea and all Q&A answers that seed AI generation. The conversation itself is a first-class artifact. | Startup | Created when session starts. Completed when user proceeds to generation. |
| `session_answers` | Individual Q&A pairs from the founder session. Normalized for analytics and per-question-type retrieval during prompt construction. | Session | Inserted incrementally during session. Never updated after insertion. |
| `opportunity_assessments` | Parent record for the opportunity assessment artifact. One per startup. | Startup | Created on first assessment generation. |
| `opportunity_assessment_versions` | Append-only version history. Each generation produces one new row. | Assessment | Never updated after insertion. `is_current` flipped via transaction. |
| `blueprints` | Parent record for the blueprint artifact. One per startup. | Startup | Created on first blueprint generation. |
| `blueprint_versions` | Append-only version history. | Blueprint | Same pattern as assessment versions. |
| `workspace_graphs` | Parent record for the workspace artifact. One per startup. | Startup | Created on first workspace generation. |
| `workspace_graph_versions` | Append-only version history. | Workspace | Same pattern as above. |
| `workspace_asset_configs` | User overrides to individual workspace nodes: status and configuration values. Separate from the immutable graph versions. | Workspace | Upserted when user configures a node. Never versioned. |
| `preview_contexts` | Cached `PreviewContext` generated after workspace creation. Prevents expensive runtime re-derivation. | Workspace | Replaced (not versioned) when the workspace is regenerated. |
| `generation_jobs` | One row per agent execution attempt. Tracks status, progress, stage states, prompt version, model, and errors. | User + Startup | Status/progress columns are updated. Never deleted. |
| `ai_usage_log` | One row per Claude API call. Records model, input/output tokens, and computed cost. | User | Append-only. Never deleted. Required for cost attribution. |
| `deploy_environments` | Configuration for production, staging, and development deployment environments. | Startup | Created when user first configures a deployment. Updated by user. |
| `deploy_env_vars` | Encrypted key-value pairs per deployment environment. | Environment | Upserted per key. Hard-deleted when a key is removed (not user data — configuration). |
| `releases` | Deployment history — one row per deploy attempt. | Environment | Append-only. Never deleted. |
| `activity_log` | User-facing chronological event feed and internal audit trail. | User + Startup | Append-only. Never deleted. |

---

## Database Design

### ERD

```
profiles ──────────────────────────────────────── startups
(id FK auth.users)                    (user_id FK, lifecycle_stage, category)
                                               │
               ┌───────────────────────────────┼────────────────────────────┐
               │                               │                            │
        founder_sessions              opportunity_assessments           blueprints
        (startup_id, idea, status)    (startup_id, session_id)    (startup_id, session_id,
               │                               │                   assessment_id nullable)
        session_answers                        │                            │
        (session_id,                  opp_assessment_versions      blueprint_versions
         question_type,               (assessment_id,              (blueprint_id,
         sequence_order)               content JSONB,               content JSONB,
                                       is_current,                  is_current,
                                       generation_job_id)           generation_job_id)

               workspace_graphs ──────────────────────── preview_contexts
               (startup_id UNIQUE,                       (startup_id UNIQUE,
                blueprint_id nullable)                    content JSONB)
                       │
          ┌────────────┴──────────────┐
          │                           │
   workspace_graph_versions    workspace_asset_configs
   (workspace_id,              (workspace_id,
    graph JSONB,                asset_id TEXT,
    is_current,                 status,
    generation_job_id)          config JSONB)

generation_jobs ─────────────────────────────── ai_usage_log
(user_id, startup_id,                          (user_id, startup_id,
 parent_job_id nullable,                        generation_job_id,
 type, status, progress,                        model, tokens, cost_usd)
 stages JSONB, prompt_version,
 idempotency_key UNIQUE)

deploy_environments
(startup_id, name ENUM, platform, url)
       │
  ┌────┴──────────────┐
  │                   │
deploy_env_vars     releases
(environment_id,    (environment_id,
 key, value_enc)     version, status,
                     commit_sha)

activity_log
(user_id, startup_id nullable, type, description, meta JSONB)
```

### Tables

```sql
-- ─────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────

CREATE TYPE lifecycle_stage AS ENUM (
  'founder-session', 'generating', 'preview', 'build', 'deployed'
);
CREATE TYPE session_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE question_type AS ENUM (
  'problem', 'customer', 'market', 'competition',
  'revenue', 'team', 'vision', 'assumption'
);
CREATE TYPE generation_job_type AS ENUM (
  'opportunity', 'blueprint', 'workspace', 'preview', 'full'
);
CREATE TYPE generation_job_status AS ENUM (
  'pending', 'active', 'done', 'failed', 'cancelled'
);
CREATE TYPE release_status AS ENUM ('queued', 'in_progress', 'success', 'failed');
CREATE TYPE environment_name AS ENUM ('production', 'staging', 'development');
CREATE TYPE ai_purpose AS ENUM (
  'chat', 'opportunity_gen', 'blueprint_gen', 'workspace_gen', 'preview_gen'
);
CREATE TYPE startup_category AS ENUM (
  'saas', 'marketplace', 'fintech', 'healthcare',
  'ecommerce', 'developer-tool', 'ai-tool', 'social', 'other'
);

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────

CREATE TABLE profiles (
  id                       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name             TEXT,
  avatar_url               TEXT,
  onboarding_completed_at  TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- STARTUPS
-- ─────────────────────────────────────────

CREATE TABLE startups (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  category         startup_category,
  lifecycle_stage  lifecycle_stage NOT NULL DEFAULT 'founder-session',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ                            -- soft delete
);

-- ─────────────────────────────────────────
-- FOUNDER SESSIONS
-- ─────────────────────────────────────────

CREATE TABLE founder_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id  UUID NOT NULL REFERENCES startups(id),
  user_id     UUID NOT NULL,
  idea        TEXT NOT NULL,
  status      session_status NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE session_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES founder_sessions(id),
  question_id     TEXT NOT NULL,
  question_type   question_type NOT NULL DEFAULT 'problem',
  question        TEXT NOT NULL,
  answer          TEXT NOT NULL CHECK (char_length(answer) <= 2000),
  sequence_order  INTEGER NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- OPPORTUNITY ASSESSMENTS
-- ─────────────────────────────────────────

CREATE TABLE opportunity_assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id  UUID NOT NULL REFERENCES startups(id),
  session_id  UUID NOT NULL REFERENCES founder_sessions(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE opportunity_assessment_versions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id      UUID NOT NULL REFERENCES opportunity_assessments(id),
  version_number     INTEGER NOT NULL,
  content            JSONB NOT NULL,
  is_current         BOOLEAN NOT NULL DEFAULT FALSE,
  generation_job_id  UUID,                               -- set after job completes
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assessment_id, version_number)
);

CREATE UNIQUE INDEX idx_current_opportunity_version
  ON opportunity_assessment_versions(assessment_id)
  WHERE is_current = TRUE;

-- ─────────────────────────────────────────
-- BLUEPRINTS
-- ─────────────────────────────────────────

CREATE TABLE blueprints (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id     UUID NOT NULL REFERENCES startups(id),
  session_id     UUID NOT NULL REFERENCES founder_sessions(id),
  assessment_id  UUID REFERENCES opportunity_assessments(id),  -- nullable
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blueprint_versions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id       UUID NOT NULL REFERENCES blueprints(id),
  version_number     INTEGER NOT NULL,
  content            JSONB NOT NULL,
  is_current         BOOLEAN NOT NULL DEFAULT FALSE,
  generation_job_id  UUID,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (blueprint_id, version_number)
);

CREATE UNIQUE INDEX idx_current_blueprint_version
  ON blueprint_versions(blueprint_id)
  WHERE is_current = TRUE;

-- ─────────────────────────────────────────
-- WORKSPACE GRAPHS
-- ─────────────────────────────────────────

CREATE TABLE workspace_graphs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id    UUID NOT NULL UNIQUE REFERENCES startups(id),
  blueprint_id  UUID REFERENCES blueprints(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_graph_versions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       UUID NOT NULL REFERENCES workspace_graphs(id),
  version_number     INTEGER NOT NULL,
  graph              JSONB NOT NULL,
  is_current         BOOLEAN NOT NULL DEFAULT FALSE,
  generation_job_id  UUID,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, version_number)
);

CREATE UNIQUE INDEX idx_current_workspace_version
  ON workspace_graph_versions(workspace_id)
  WHERE is_current = TRUE;

CREATE TABLE workspace_asset_configs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspace_graphs(id),
  asset_id      TEXT NOT NULL,
  status        TEXT,
  config        JSONB,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, asset_id)
);

-- ─────────────────────────────────────────
-- PREVIEW CONTEXTS
-- ─────────────────────────────────────────

CREATE TABLE preview_contexts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id            UUID NOT NULL UNIQUE REFERENCES startups(id),
  workspace_version_id  UUID REFERENCES workspace_graph_versions(id),
  content               JSONB NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- GENERATION JOBS
-- ─────────────────────────────────────────

CREATE TABLE generation_jobs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL,
  startup_id        UUID NOT NULL REFERENCES startups(id),
  parent_job_id     UUID REFERENCES generation_jobs(id),
  type              generation_job_type NOT NULL,
  status            generation_job_status NOT NULL DEFAULT 'pending',
  artifact_id       UUID,
  artifact_type     TEXT,
  prompt_version    TEXT,
  model             TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  idempotency_key   TEXT UNIQUE,
  progress          INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  stages            JSONB NOT NULL DEFAULT '[]',
  error             TEXT,
  attempt_number    INTEGER NOT NULL DEFAULT 1,
  max_attempts      INTEGER NOT NULL DEFAULT 3,
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- AI USAGE LOG
-- ─────────────────────────────────────────

CREATE TABLE ai_usage_log (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL,
  startup_id           UUID REFERENCES startups(id),
  generation_job_id    UUID REFERENCES generation_jobs(id),
  model                TEXT NOT NULL,
  input_tokens         INTEGER NOT NULL,
  output_tokens        INTEGER NOT NULL,
  cost_usd             DECIMAL(10, 6) NOT NULL,
  purpose              ai_purpose NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- DEPLOY
-- ─────────────────────────────────────────

CREATE TABLE deploy_environments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id     UUID NOT NULL REFERENCES startups(id),
  name           environment_name NOT NULL,
  branch         TEXT,
  region         TEXT,
  platform       TEXT,
  build_command  TEXT,
  output_dir     TEXT,
  url            TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (startup_id, name)
);

CREATE TABLE deploy_env_vars (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id    UUID NOT NULL REFERENCES deploy_environments(id) ON DELETE CASCADE,
  key               TEXT NOT NULL,
  value_encrypted   TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (environment_id, key)
);

CREATE TABLE releases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id  UUID NOT NULL REFERENCES deploy_environments(id),
  version         TEXT NOT NULL,
  status          release_status NOT NULL DEFAULT 'queued',
  commit_sha      TEXT,
  triggered_by    UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ACTIVITY LOG
-- ─────────────────────────────────────────

CREATE TABLE activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  startup_id  UUID REFERENCES startups(id),
  type        TEXT NOT NULL,
  description TEXT NOT NULL,
  meta        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
-- Startup queries
CREATE INDEX idx_startups_user_id ON startups(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_startups_lifecycle ON startups(user_id, lifecycle_stage) WHERE deleted_at IS NULL;

-- Session queries
CREATE INDEX idx_sessions_startup_id ON founder_sessions(startup_id);
CREATE INDEX idx_answers_session_id ON session_answers(session_id);
CREATE INDEX idx_answers_type ON session_answers(session_id, question_type);

-- Artifact parent queries
CREATE INDEX idx_assessments_startup_id ON opportunity_assessments(startup_id);
CREATE INDEX idx_blueprints_startup_id ON blueprints(startup_id);

-- Version history
CREATE INDEX idx_opp_versions ON opportunity_assessment_versions(assessment_id, version_number DESC);
CREATE INDEX idx_blueprint_versions ON blueprint_versions(blueprint_id, version_number DESC);
CREATE INDEX idx_workspace_versions ON workspace_graph_versions(workspace_id, version_number DESC);

-- Generation jobs
CREATE INDEX idx_jobs_startup ON generation_jobs(startup_id, created_at DESC);
CREATE INDEX idx_jobs_rate_limit ON generation_jobs(user_id, type, created_at DESC);
CREATE INDEX idx_jobs_parent ON generation_jobs(parent_job_id) WHERE parent_job_id IS NOT NULL;

-- AI usage
CREATE INDEX idx_usage_user ON ai_usage_log(user_id, created_at DESC);
CREATE INDEX idx_usage_startup ON ai_usage_log(startup_id, created_at DESC) WHERE startup_id IS NOT NULL;
CREATE INDEX idx_usage_job ON ai_usage_log(generation_job_id) WHERE generation_job_id IS NOT NULL;

-- Activity feed
CREATE INDEX idx_activity_user ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_startup ON activity_log(startup_id, created_at DESC) WHERE startup_id IS NOT NULL;

-- Deploy
CREATE INDEX idx_releases_env ON releases(environment_id, created_at DESC);
```

### startup_health — Computed View

`startup_health` is a SQL view. There is no `startup_health` table. This eliminates the synchronization problem that would arise from persisting derived state.

```sql
CREATE VIEW startup_health AS
SELECT
  s.id AS startup_id,
  CASE
    WHEN wv.id IS NOT NULL AND r.status = 'success' THEN 90
    WHEN wv.id IS NOT NULL THEN 70
    WHEN bv.id IS NOT NULL THEN 50
    WHEN ov.id IS NOT NULL THEN 30
    ELSE 10
  END                                          AS score,
  COALESCE(latest_job.progress, 0)             AS generation_progress,
  (wv.id IS NOT NULL)                          AS deployment_ready,
  COALESCE(asset_count.count, 0)               AS asset_count,
  COALESCE(r.status, 'not-started')            AS deployment_status
FROM startups s
LEFT JOIN opportunity_assessment_versions ov
  ON ov.assessment_id = (SELECT id FROM opportunity_assessments WHERE startup_id = s.id LIMIT 1)
 AND ov.is_current = TRUE
LEFT JOIN blueprint_versions bv
  ON bv.blueprint_id = (SELECT id FROM blueprints WHERE startup_id = s.id LIMIT 1)
 AND bv.is_current = TRUE
LEFT JOIN workspace_graph_versions wv
  ON wv.workspace_id = (SELECT id FROM workspace_graphs WHERE startup_id = s.id LIMIT 1)
 AND wv.is_current = TRUE
LEFT JOIN LATERAL (
  SELECT progress FROM generation_jobs
  WHERE startup_id = s.id ORDER BY created_at DESC LIMIT 1
) latest_job ON TRUE
LEFT JOIN LATERAL (
  SELECT r2.status FROM releases r2
  JOIN deploy_environments e ON r2.environment_id = e.id
  WHERE e.startup_id = s.id AND e.name = 'production'
  ORDER BY r2.created_at DESC LIMIT 1
) r ON TRUE
LEFT JOIN LATERAL (
  SELECT jsonb_array_length(graph -> 'assets') AS count
  FROM workspace_graph_versions
  WHERE workspace_id = (SELECT id FROM workspace_graphs WHERE startup_id = s.id LIMIT 1)
    AND is_current = TRUE
) asset_count ON TRUE;
```

### Soft Delete Strategy

Only `startups` uses soft delete (`deleted_at TIMESTAMPTZ`). All queries filter `WHERE deleted_at IS NULL`. All other entities are either append-only (logs, versions) or hard-deleted only when their parent is removed (e.g., `deploy_env_vars` cascade-deleted when an environment is deleted).

---

## Artifact Contracts

All contracts are defined in `src/lib/contracts/`. These are the canonical Zod schemas and TypeScript types for AI-generated content. Every agent validates its output against these schemas before persistence.

All artifact content types include a `_meta` object with `schemaVersion`, `generatedAt`, `model`, and `promptVersion`. When an artifact schema requires a breaking change, increment `schemaVersion`. Old version rows remain valid under the schema they were generated with.

### OpportunityAssessment

**Purpose:** Market, customer, competition, risk, and opportunity analysis. This is the first AI-generated artifact and the core of the Xenysis value proposition.

**Lifecycle:** Created by `OpportunityAgent`. Versioned on every regeneration. Passed as context to `BlueprintAgent`.

**Input:** Founder session idea + all session answers.

```typescript
// src/lib/contracts/opportunity-assessment.ts

import { z } from 'zod'

export const OPPORTUNITY_SCHEMA_VERSION = '1.0' as const

export const RiskSeveritySchema = z.enum(['high', 'medium', 'low'])

export const OpportunityVerdictSchema = z.enum(['strong', 'moderate', 'weak', 'too-early'])

export const OpportunityAssessmentSchema = z.object({
  _meta: z.object({
    schemaVersion: z.literal('1.0'),
    generatedAt:   z.string().datetime(),
    model:         z.string(),
    promptVersion: z.string(),
  }),

  verdict:         OpportunityVerdictSchema,
  confidenceScore: z.number().int().min(0).max(100),
  oneLiner:        z.string().max(220),

  whyNow:          z.array(z.string().max(300)).min(1).max(5),
  whyItCanWin:     z.array(z.string().max(300)).min(1).max(5),
  expectedOutcome: z.string().max(500),

  biggestRisks: z.array(z.object({
    risk:       z.string().max(200),
    severity:   RiskSeveritySchema,
    mitigation: z.string().max(300),
  })).min(1).max(5),

  customerProfile: z.object({
    primarySegment:    z.string().max(120),
    painPoint:         z.string().max(300),
    buyingTrigger:     z.string().max(200),
    willingnessToPay:  z.string().max(100),
    channelHypothesis: z.string().max(200),
  }),

  marketSizing: z.object({
    tam:         z.string().max(100),
    sam:         z.string().max(100),
    som:         z.string().max(100),
    methodology: z.string().max(500),
  }),

  competitivePosition: z.string().max(400),
  alternatives: z.array(z.object({
    name:     z.string().max(100),
    weakness: z.string().max(200),
  })).max(5),

  researchConfidence: z.array(z.object({
    factor:    z.string().max(100),
    score:     z.number().int().min(0).max(10),
    rationale: z.string().max(200),
  })).min(3).max(10),

  assumptions: z.array(z.object({
    assumption:       z.string().max(200),
    risk:             RiskSeveritySchema,
    validationMethod: z.string().max(200),
  })).min(1).max(8),

  trustSignals: z.array(z.string().max(200)).max(5),
})

export type OpportunityAssessment = z.infer<typeof OpportunityAssessmentSchema>
```

---

### StartupBlueprint

**Purpose:** Product strategy, business model, MVP scope, pricing, and system plan. Transforms the opportunity analysis into a buildable product definition.

**Lifecycle:** Created by `BlueprintAgent`. Versioned on every regeneration. Passed as context to `WorkspaceAgent`.

**Input:** Founder session answers + current `OpportunityAssessment` (if available).

```typescript
// src/lib/contracts/startup-blueprint.ts

import { z } from 'zod'

export const BLUEPRINT_SCHEMA_VERSION = '1.0' as const

export const BusinessModelSchema = z.enum([
  'b2b-saas', 'b2c-saas', 'marketplace', 'api-product',
  'transactional', 'usage-based', 'freemium', 'enterprise', 'other',
])

export const StartupBlueprintSchema = z.object({
  _meta: z.object({
    schemaVersion: z.literal('1.0'),
    generatedAt:   z.string().datetime(),
    model:         z.string(),
    promptVersion: z.string(),
  }),

  businessModel:      BusinessModelSchema,
  revenueModel:       z.string().max(200),
  detectedPattern:    z.string().max(120),
  category:           z.enum(['saas','marketplace','fintech','healthcare','ecommerce','developer-tool','ai-tool','social','other']),
  architectureScore:  z.number().int().min(0).max(100),
  workflowConfidence: z.enum(['high', 'medium', 'low']),

  systems: z.array(z.object({
    name:        z.string().max(100),
    type:        z.enum(['frontend','backend','database','integration','workflow','ai']),
    priority:    z.enum(['core','optional','post-mvp']),
    description: z.string().max(300),
  })).min(3).max(20),

  recommendedStack: z.object({
    frontend:     z.array(z.string()).max(5),
    backend:      z.array(z.string()).max(5),
    database:     z.array(z.string()).max(3),
    infra:        z.array(z.string()).max(4),
    integrations: z.array(z.string()).max(8),
  }),

  mvpScope: z.object({
    included:       z.array(z.string().max(150)).min(3).max(10),
    excluded:       z.array(z.string().max(150)).max(8),
    estimatedWeeks: z.number().int().min(4).max(26),
  }),

  pricingTiers: z.array(z.object({
    name:          z.string().max(50),
    price:         z.string().max(50),
    billingCycle:  z.enum(['monthly','annual','usage','custom']),
    features:      z.array(z.string().max(100)).min(3).max(10),
    isRecommended: z.boolean().default(false),
  })).min(2).max(4),

  coreEntities: z.array(z.object({
    name:        z.string().max(50),
    description: z.string().max(200),
    keyFields:   z.array(z.string()).max(8),
  })).min(2).max(8),
})

export type StartupBlueprint = z.infer<typeof StartupBlueprintSchema>
```

---

### WorkspaceGraph

**Purpose:** The interactive architecture graph visualized on the Workspace canvas. Represents all pages, databases, services, integrations, workflows, and their typed relationships.

**Lifecycle:** Created by `WorkspaceAgent`. Versioned on every regeneration. Backend stores `iconName` as a string; frontend maps to a `LucideIcon` component before rendering.

**Input:** Current `StartupBlueprint`.

**Validation rules:**
- All connector `from`/`to` values must reference valid asset IDs in the same graph
- Maximum 3 hub nodes per graph
- Assets: 5–60 nodes; Connectors: up to 120

```typescript
// src/lib/contracts/workspace-graph.ts

import { z } from 'zod'

export const WORKSPACE_SCHEMA_VERSION = '1.0' as const

export const WorkspaceAssetSchema = z.object({
  id:          z.string().min(1).max(100),
  nodeType:    z.enum(['page','database','workflow','api','integration','system']),
  assetType:   z.enum([
    'marketing','auth','onboarding','core','settings','billing',
    'table','view',
    'automation','trigger','scheduled',
    'rest-endpoint','webhook',
    'payment','email','auth-provider','storage','analytics','crm',
    'service','middleware','ai-service',
  ]),
  status:      z.enum(['generated','needs-config','planned']),
  title:       z.string().max(100),
  description: z.string().max(300),
  route:       z.string().max(200).optional(),
  iconName:    z.string().max(50),

  x: z.number(), y: z.number(),
  w: z.number().positive(), h: z.number().positive(),
  revealDelay: z.number().min(0),
  isHub:       z.boolean().optional(),

  purpose:          z.string().max(200),
  impact:           z.string().max(200),
  aiRecommendation: z.string().max(300).optional(),
  dependencies:     z.array(z.string()).max(10),
})

export const WorkspaceConnectorSchema = z.object({
  id:               z.string().min(1),
  from:             z.string(),
  to:               z.string(),
  relationshipType: z.enum(['navigates-to','reads','writes','uses','triggers','calls','authenticates','sends']),
  fromSide:         z.enum(['top','bottom','left','right']),
  toSide:           z.enum(['top','bottom','left','right']),
  animated:         z.boolean().optional(),
  label:            z.string().max(50).optional(),
})

export const WorkspaceGraphSchema = z.object({
  _meta: z.object({
    schemaVersion: z.literal('1.0'),
    generatedAt:   z.string().datetime(),
    model:         z.string(),
    promptVersion: z.string(),
  }),
  assets:     z.array(WorkspaceAssetSchema).min(5).max(60),
  connectors: z.array(WorkspaceConnectorSchema).max(120),
})
.refine(
  (g) => {
    const ids = new Set(g.assets.map((a) => a.id))
    return g.connectors.every((c) => ids.has(c.from) && ids.has(c.to))
  },
  { message: 'Connector references an asset id that does not exist' },
)
.refine(
  (g) => g.assets.filter((a) => a.isHub).length <= 3,
  { message: 'Maximum 3 hub nodes allowed' },
)

export type WorkspaceAsset     = z.infer<typeof WorkspaceAssetSchema>
export type WorkspaceConnector = z.infer<typeof WorkspaceConnectorSchema>
export type WorkspaceGraph     = z.infer<typeof WorkspaceGraphSchema>
```

---

### PreviewContext

**Purpose:** Cached UI context for the Preview screen. Generated once after workspace creation and served directly — no runtime derivation. Eliminates repeated expensive AI calls for data that changes only when the workspace changes.

**Lifecycle:** Generated inline as part of workspace generation (or as a child job). Replaced (not versioned) when the workspace is regenerated. Stored in `preview_contexts.content`.

```typescript
// src/lib/contracts/preview-context.ts

import { z } from 'zod'

export const PreviewContextSchema = z.object({
  _meta: z.object({
    schemaVersion:      z.literal('1.0'),
    generatedAt:        z.string().datetime(),
    workspaceVersionId: z.string().uuid(),
  }),

  name:     z.string(),
  domain:   z.string(),
  tagline:  z.string(),
  category: z.string(),

  designProfile: z.object({
    primaryColor:      z.string(),
    secondaryColor:    z.string(),
    backgroundColor:   z.string(),
    font:              z.string(),
    navigationPattern: z.enum(['sidebar-icon','sidebar-full','topnav']),
    density:           z.enum(['compact','normal','spacious']),
  }),

  hero: z.object({
    badge:        z.string(),
    headline:     z.string(),
    subheadline:  z.string(),
    cta:          z.string(),
    ctaSecondary: z.string(),
  }),

  marketingNav: z.array(z.string()).max(6),
  features:     z.array(z.object({ label: z.string(), sub: z.string() })).max(8),
  appNav:       z.array(z.object({ iconName: z.string(), label: z.string() })).max(8),
  metrics:      z.array(z.object({
    label: z.string(), value: z.string(),
    delta: z.string(), up: z.boolean(),
  })).max(6),

  planNames:    z.tuple([z.string(), z.string(), z.string()]),
  planPrices:   z.tuple([z.string(), z.string(), z.string()]),
  planFeatures: z.object({
    starter:    z.array(z.string()),
    pro:        z.array(z.string()),
    enterprise: z.array(z.string()),
  }),
})

export type PreviewContext = z.infer<typeof PreviewContextSchema>
```

---

## Agent Architecture

### Design Rules

1. Agents are modules in `src/agents/`. Each is a self-contained directory.
2. Agents own: prompt construction, Claude invocation, Zod validation, artifact persistence, `ai_usage_log` writes, `activity_log` writes, SSE event emission.
3. Agents do not own: HTTP routing, `generation_jobs` state transitions, SSE connection management.
4. The `AgentRunner` (`src/agents/base/runner.ts`) owns job orchestration.
5. Route handlers create a `generation_jobs` row, then call the runner.
6. Artifacts are the source of truth — agents write them, everything else reads them.
7. Future sub-agents are internal to the agent that uses them; they do not create `generation_jobs` rows.

### Base Interface

```typescript
// src/agents/base/agent.interface.ts

export interface AgentInput {
  userId:    string
  startupId: string
  jobId:     string
}

export interface AgentContext<TInput extends AgentInput> {
  input:     TInput
  db:        DrizzleDB
  anthropic: Anthropic   // BlueprintAgent, WorkspaceAgent
  openai:    OpenAI      // OpportunityAgent, Founder Session interactions
}

export interface Agent<TInput extends AgentInput, TOutput> {
  readonly name:          string
  readonly promptVersion: string
  execute(ctx: AgentContext<TInput>): AsyncGenerator<GenerationEvent, TOutput>
}
```

### AgentRunner

The single integration point between route handlers and agents. Owns retry logic, job state transitions, and SSE event forwarding.

```typescript
// src/agents/base/runner.ts

export async function* runAgent<TInput extends AgentInput, TOutput>(
  agent:     Agent<TInput, TOutput>,
  input:     TInput,
  db:        DrizzleDB,
  anthropic: Anthropic,
  openai:    OpenAI,
): AsyncGenerator<GenerationEvent, TOutput> {

  const job = await db.query.generationJobs.findFirst({
    where: eq(generationJobs.id, input.jobId),
  })
  if (!job) throw new Error(`Job ${input.jobId} not found`)

  await db.update(generationJobs)
    .set({ status: 'active', startedAt: new Date() })
    .where(eq(generationJobs.id, job.id))

  let lastError: unknown

  for (let attempt = 1; attempt <= job.maxAttempts; attempt++) {
    try {
      const gen = agent.execute({ input, db, anthropic, openai })
      for await (const event of gen) {
        if (event.type === 'stage' || event.type === 'progress') {
          await syncJobProgress(db, job.id, event)
        }
        yield event
      }
      const result = (await gen.return(undefined as unknown as TOutput)).value
      await db.update(generationJobs)
        .set({ status: 'done', progress: 100, completedAt: new Date() })
        .where(eq(generationJobs.id, job.id))
      return result
    } catch (err) {
      lastError = err
      if (attempt < job.maxAttempts) {
        yield { type: 'log', data: { message: `Attempt ${attempt} failed, retrying…`, level: 'warn' } }
        await db.update(generationJobs)
          .set({ attemptNumber: attempt + 1 })
          .where(eq(generationJobs.id, job.id))
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : 'Unknown error'
  await db.update(generationJobs)
    .set({ status: 'failed', error: message, completedAt: new Date() })
    .where(eq(generationJobs.id, job.id))
  yield { type: 'error', data: { code: 'MAX_RETRIES_EXCEEDED', message, retryable: false } }
  throw lastError
}
```

---

### OpportunityAgent

| Property | Value |
|---|---|
| **Module** | `src/agents/opportunity-agent/` |
| **Input** | `{ userId, startupId, jobId, sessionId }` |
| **Output** | `OpportunityAssessment` |
| **Artifact written** | `opportunity_assessment_versions` |
| **Prompt version** | `opportunity-v1.0` (increment on prompt change) |

**Responsibilities:**
- Market sizing analysis (TAM, SAM, SOM)
- Customer segment identification and pain point mapping
- Competitive landscape assessment
- Risk identification, severity scoring, and mitigation suggestions
- Opportunity verdict and confidence score calculation

**Stages emitted:**
1. `analyzing-idea` — Parsing founder session context
2. `market-analysis` — Evaluating market size and timing
3. `customer-analysis` — Identifying primary customer segment
4. `risk-analysis` — Scoring risks and assumptions
5. `scoring` — Calculating opportunity score and verdict

**Validation:** `OpportunityAssessmentSchema` (Zod). On failure, Zod errors are included in the next OpenAI message turn. Up to 3 attempts.

**Persistence:** Inserts into `opportunity_assessment_versions` with `is_current = TRUE`. Flips previous current to `FALSE` in the same transaction. Upserts `opportunity_assessments` parent row if it does not exist.

**Module structure:**
```
opportunity-agent/
├── index.ts            ← OpportunityAgent class
├── prompt.ts           ← PROMPT_VERSION, buildSystemPrompt(), buildUserMessage()
├── context-builder.ts  ← buildOpportunityInput(db, startupId, sessionId)
└── persist.ts          ← createOrUpdateAssessment(db, ...)
```

**Future extensibility:** When `ResearchAgent` and `MarketAgent` are introduced, they become private functions or classes inside `opportunity-agent/`. The agent's `execute()` method calls them before the synthesis OpenAI call. The `OpportunityAssessment` contract, the API endpoint, and the `generation_jobs` row do not change.

---

### BlueprintAgent

| Property | Value |
|---|---|
| **Module** | `src/agents/blueprint-agent/` |
| **Input** | `{ userId, startupId, jobId, sessionId, assessmentVersionId? }` |
| **Output** | `StartupBlueprint` |
| **Artifact written** | `blueprint_versions` |
| **Prompt version** | `blueprint-v1.0` |

**Responsibilities:**
- Business model classification
- MVP scope definition (included, excluded, estimated weeks)
- Pricing tier design (2–4 tiers)
- Core system identification and prioritization
- Tech stack recommendations
- Core data entity identification

**Stages emitted:**
1. `business-model` — Classifying revenue model and business pattern
2. `system-planning` — Designing core systems
3. `mvp-scope` — Defining included and excluded scope
4. `pricing-design` — Building pricing tiers
5. `entity-mapping` — Identifying core data entities

**Context:** Includes the full `OpportunityAssessment` JSON when available. The assessment's `customerProfile`, `marketSizing`, and `biggestRisks` directly inform scope and pricing decisions.

**Module structure:**
```
blueprint-agent/
├── index.ts
├── prompt.ts
├── context-builder.ts  ← buildBlueprintInput(db, startupId, sessionId, assessmentVersionId?)
└── persist.ts
```

**Future extensibility:** When `TechnicalArchitectAgent` is introduced, it becomes an internal call within `BlueprintAgent` to produce detailed system specifications. The `StartupBlueprint` contract extends with new fields under a new `schemaVersion`.

---

### WorkspaceAgent

| Property | Value |
|---|---|
| **Module** | `src/agents/workspace-agent/` |
| **Input** | `{ userId, startupId, jobId, blueprintVersionId? }` |
| **Output** | `WorkspaceGraph` |
| **Artifact written** | `workspace_graph_versions` |
| **Prompt version** | `workspace-v1.0` |

**Responsibilities:**
- Workspace graph generation (nodes and connectors)
- Architecture visualization from blueprint systems
- Domain-specific asset creation for pages, databases, integrations, and workflows
- Graph normalization: connector cross-reference validation, layout coordinate normalization, hub node limit enforcement

**Graph seeding strategy:** The first 5 assets (Landing, Signup, Login, Dashboard, Settings) are deterministically pre-populated by the agent before the Anthropic Claude call. Claude generates domain-specific additions only. This prevents hallucination of universal patterns and keeps the graph grounded.

**Stages emitted:**
1. `seeding-graph` — Pre-populating deterministic scaffold assets
2. `generating-pages` — Creating domain-specific page nodes
3. `generating-data-layer` — Database tables and views
4. `generating-services` — Backend services and integrations
5. `generating-workflows` — Automations and triggers
6. `wiring-connectors` — Connecting nodes with typed relationships
7. `assembling-workspace` — Validation, normalization, and persistence

**Post-processing (graph-normalizer.ts):** After Claude returns the graph, before persistence:
1. Validate all connector `from`/`to` IDs exist in the assets array
2. Deduplicate asset IDs
3. Clamp canvas coordinates to a valid layout grid
4. Enforce max 3 hub nodes
5. If validation fails: include errors in the retry message

**Module structure:**
```
workspace-agent/
├── index.ts
├── prompt.ts
├── context-builder.ts   ← buildWorkspaceInput(db, startupId, blueprintVersionId?)
├── graph-normalizer.ts  ← validateAndNormalize(graph): WorkspaceGraph
└── persist.ts
```

**After persistence:** Triggers `PreviewContext` generation inline (or as a child job). The `preview_contexts` row is upserted for the startup.

---

### Future Agents

These agents are documented for planning purposes. They are not implemented at MVP.

| Agent | Purpose | Integration Point |
|---|---|---|
| `ResearchAgent` | Deep market research using external data sources | Internal to `OpportunityAgent` |
| `CriticAgent` | Adversarial review of opportunity and blueprint | New `generation_job_type = 'critique'` |
| `TechnicalArchitectAgent` | Detailed technical design: API specs, DB schema, infra | Internal to `BlueprintAgent` |
| `PreviewAgent` | Full `PreviewContext` generation from workspace graph | Replaces inline preview generation |

None of these require changes to existing artifact contracts or API endpoints when introduced.

---

## Generation Job System

### Job Lifecycle

```
  Route handler creates job row (status = 'pending')
            │
  runAgent() called → status = 'active', started_at = NOW()
            │
    ┌───────┴──────────────────┐
    │                          │
  Agent succeeds           Agent throws
    │                          │
  status = 'done'    attempt_number < max_attempts?
  progress = 100         │              │
  artifact_id set       YES             NO
  completed_at set       │              │
                    [Retry loop]   status = 'failed'
                                   error message stored
                                   completed_at = NOW()
```

User can cancel an active job: `POST /jobs/:id/cancel` sets `status = 'cancelled'`, `cancelled_at = NOW()`.

### Retry Strategy

- Default: `max_attempts = 3`
- On Zod validation failure: re-invoke agent with validation error message prepended to the user turn
- On Anthropic API error (429, 529): exponential backoff within the attempt
- On persistent failure: mark job `failed`, store error message, do not retry automatically

### Idempotency

Every generation request accepts an optional `idempotencyKey`. Before creating a job row:

```typescript
const existing = await db.query.generationJobs.findFirst({
  where: and(
    eq(generationJobs.idempotencyKey, idempotencyKey),
    notInArray(generationJobs.status, ['failed', 'cancelled']),
  ),
})
if (existing) return streamExistingJob(existing, c)
```

This prevents duplicate generations from network retries or double-clicks.

### Parent/Child Jobs

`POST /startups/:id/generate` (full pipeline) creates a parent job and three children:

```
job_parent  (type = 'full')
  ├── job_A  (type = 'opportunity', parent_job_id = job_parent.id)  ← runs first
  ├── job_B  (type = 'blueprint',   parent_job_id = job_parent.id)  ← runs after A done
  └── job_C  (type = 'workspace',   parent_job_id = job_parent.id)  ← runs after B done
```

The parent SSE stream aggregates child events. Individual artifact endpoints create standalone jobs with no parent.

### SSE Architecture

**SSE response headers (required):**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
X-Accel-Buffering: no
```

**Event format:**
```
data: {"type":"stage","data":{"stageId":"market-analysis","label":"Analyzing market","sublabel":"Evaluating size and timing","state":"active"}}\n\n
```

**Event types:**
```typescript
type GenerationEvent =
  | { type: 'stage';    data: { stageId: string; label: string; sublabel: string; state: 'pending' | 'active' | 'done' } }
  | { type: 'progress'; data: { percent: number } }
  | { type: 'log';      data: { message: string; level: 'info' | 'warn' } }
  | { type: 'complete'; data: { artifactId: string; versionId: string; artifactType: string } }
  | { type: 'error';    data: { code: string; message: string; retryable: boolean } }
```

**Reconnect:** On disconnect, the client calls `GET /jobs/:id` to retrieve the current `stages` JSONB, then reconnects to `GET /jobs/:id/stream?since=<stageId>`. The server replays all stages after `since` from the stored JSONB, then streams new events live.

**Critical:** SSE endpoints must be called against the Railway URL directly. They must not be proxied through Next.js API routes. Vercel Edge Function timeout limits (25s Hobby / 60s Pro) will terminate long-running generation streams.

### Prompt Versioning

Each agent's `prompt.ts` exports a version constant:

```typescript
export const PROMPT_VERSION = 'opportunity-v1.0' as const
```

This string is written to `generation_jobs.prompt_version` on every invocation. When a prompt is changed, the version is incremented. Old job rows retain the prompt version that produced them, enabling regression analysis when an output quality issue is discovered.

### AI Usage Tracking

Every AI provider call writes to `ai_usage_log` immediately after the response completes. This is not optional. Both Anthropic and OpenAI calls use the same `trackUsage` helper via a normalized `UsageRecord` shape.

```typescript
// src/agents/base/utils.ts

interface UsageRecord {
  model:        string
  inputTokens:  number
  outputTokens: number
}

// Normalize Anthropic.Message → UsageRecord
export function fromAnthropic(res: Anthropic.Message): UsageRecord {
  return { model: res.model, inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens }
}

// Normalize OpenAI ChatCompletion → UsageRecord
export function fromOpenAI(res: OpenAI.ChatCompletion): UsageRecord {
  return { model: res.model, inputTokens: res.usage?.prompt_tokens ?? 0, outputTokens: res.usage?.completion_tokens ?? 0 }
}

export async function trackUsage(db: DrizzleDB, params: {
  userId:           string
  startupId?:       string
  generationJobId?: string
  usage:            UsageRecord
  purpose:          AiPurpose
}): Promise<void> {
  // Pricing constants — update when either provider changes rates
  // Anthropic Claude Sonnet 4.6: $3.00 / $15.00 per 1M tokens (input / output)
  // OpenAI GPT-4o: $2.50 / $10.00 per 1M tokens (input / output)
  const PRICING: Record<string, { input: number; output: number }> = {
    'claude-sonnet-4-6': { input: 3.00, output: 15.00 },
    'gpt-4o':            { input: 2.50, output: 10.00 },
  }
  const rates    = PRICING[params.usage.model] ?? { input: 3.00, output: 15.00 }
  const inputCost  = (params.usage.inputTokens  / 1_000_000) * rates.input
  const outputCost = (params.usage.outputTokens / 1_000_000) * rates.output
  await db.insert(aiUsageLog).values({
    userId:          params.userId,
    startupId:       params.startupId,
    generationJobId: params.generationJobId,
    model:           params.usage.model,
    inputTokens:     params.usage.inputTokens,
    outputTokens:    params.usage.outputTokens,
    costUsd:         String((inputCost + outputCost).toFixed(6)),
    purpose:         params.purpose,
  })
}
```

Update the pricing constants when either provider changes rates.

---

## API Architecture

### Conventions

| Convention | Value |
|---|---|
| Base path | `/api/v1/` |
| Auth header | `Authorization: Bearer <supabase_access_token>` |
| Success shape | `{ data: T }` |
| Error shape | `{ error: { code: string, message: string } }` |
| List shape | `{ data: T[], total?: number, nextCursor?: string }` |
| Pagination style | Offset for bounded lists; cursor for feeds |

### Validation Strategy

All request bodies, path parameters, and query strings are validated with Zod via `zValidator` middleware. No unvalidated input reaches a route handler body. Validation errors return `400` with the field path and message.

### Error Handling Strategy

| HTTP Status | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request body or query string failed Zod validation |
| 401 | `UNAUTHENTICATED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Authenticated but not authorized for this resource |
| 404 | `NOT_FOUND` | Resource does not exist or is owned by another user |
| 409 | `CONFLICT` | State conflict (e.g., cancelling a completed job) |
| 422 | `BUSINESS_RULE` | Valid request, rejected by business logic (e.g., rate limit) |
| 429 | `RATE_LIMITED` | Generation rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Unhandled server error |

### Endpoint Inventory

```
AUTH
  GET    /api/v1/auth/me

STARTUPS
  GET    /api/v1/startups
  POST   /api/v1/startups
  GET    /api/v1/startups/:id
  PATCH  /api/v1/startups/:id
  DELETE /api/v1/startups/:id

FOUNDER SESSIONS
  POST   /api/v1/startups/:id/sessions
  GET    /api/v1/startups/:id/sessions/:sessionId
  POST   /api/v1/startups/:id/sessions/:sessionId/answers
  POST   /api/v1/startups/:id/sessions/:sessionId/messages     ← SSE: AI chat stream

OPPORTUNITY ASSESSMENT
  POST   /api/v1/startups/:id/opportunity/generate             ← SSE: OpportunityAgent
  GET    /api/v1/startups/:id/opportunity
  GET    /api/v1/startups/:id/opportunity/versions
  GET    /api/v1/startups/:id/opportunity/versions/:versionId

BLUEPRINT
  POST   /api/v1/startups/:id/blueprint/generate              ← SSE: BlueprintAgent
  GET    /api/v1/startups/:id/blueprint
  GET    /api/v1/startups/:id/blueprint/versions
  GET    /api/v1/startups/:id/blueprint/versions/:versionId

WORKSPACE
  POST   /api/v1/startups/:id/workspace/generate              ← SSE: WorkspaceAgent
  GET    /api/v1/startups/:id/workspace
  GET    /api/v1/startups/:id/workspace/versions
  GET    /api/v1/startups/:id/workspace/versions/:versionId
  PATCH  /api/v1/startups/:id/workspace/assets/:assetId

FULL GENERATION (orchestrated pipeline)
  POST   /api/v1/startups/:id/generate                        ← SSE: parent job

PREVIEW
  GET    /api/v1/startups/:id/preview-context

GENERATION JOBS
  GET    /api/v1/startups/:id/jobs
  GET    /api/v1/jobs/:jobId
  GET    /api/v1/jobs/:jobId/stream                           ← SSE: live/replay
  POST   /api/v1/jobs/:jobId/cancel

COMMAND CENTER
  GET    /api/v1/startups/:id/health
  GET    /api/v1/startups/:id/health/services
  GET    /api/v1/startups/:id/activity

DEPLOY
  GET    /api/v1/startups/:id/deploy/environments
  POST   /api/v1/startups/:id/deploy/environments
  GET    /api/v1/startups/:id/deploy/environments/:name
  PATCH  /api/v1/startups/:id/deploy/environments/:name
  GET    /api/v1/startups/:id/deploy/env-vars/:envName
  PUT    /api/v1/startups/:id/deploy/env-vars/:envName
  GET    /api/v1/startups/:id/deploy/releases
  POST   /api/v1/startups/:id/deploy                          ← stub at MVP

AI USAGE
  GET    /api/v1/usage/summary
  GET    /api/v1/usage/log
```

---

## Security Architecture

### Authentication

All routes (except static health checks) require a valid Supabase JWT in the `Authorization: Bearer` header. The `requireAuth` middleware verifies the token using `supabase.auth.getUser()` — online verification, not just JWT decode. On success, `ctx.var.user` is set for the request lifetime.

### Authorization

Ownership is enforced in application code on every query. The pattern is invariant:

```typescript
// Every query that fetches a startup-owned resource:
const startup = await db.query.startups.findFirst({
  where: and(
    eq(startups.id, startupId),
    eq(startups.userId, ctx.var.user.id),
    isNull(startups.deletedAt),
  ),
})
if (!startup) throw new NotFoundError()
```

Direct-ID endpoints (`GET /jobs/:jobId`, `GET /versions/:versionId`) verify ownership before returning data. Supabase RLS is enabled on all tables as a defence-in-depth backup.

### Rate Limiting

Generation endpoints enforce a per-user daily limit via a database count query. No Redis is required at MVP.

```typescript
// src/middleware/rate-limit.ts

const jobsToday = await db
  .select({ count: count() })
  .from(generationJobs)
  .where(and(
    eq(generationJobs.userId, ctx.var.user.id),
    gte(generationJobs.createdAt, sql`NOW() - INTERVAL '24 hours'`),
    notInArray(generationJobs.type, ['full']),  // full jobs are counted via children
  ))

if (jobsToday[0].count >= 20) {
  return c.json({ error: { code: 'RATE_LIMITED', message: 'Daily generation limit reached' } }, 429)
}
```

### Encryption

Deploy environment variable values are encrypted with AES-256-GCM before storage.

**Storage format:** `iv:authTag:ciphertext` (each segment hex-encoded, colon-delimited) as a single `TEXT` column.

**Key management:** `ENCRYPTION_KEY` is a 32-byte secret in the server's environment. It is never stored in the database, never logged, and never sent to the client. Key rotation requires a migration script that re-encrypts all values — this must be planned before the first production deploy.

### AI Abuse Prevention

| Concern | Control |
|---|---|
| Prompt injection | All user-supplied content wrapped in `<user_input>` XML tags. System prompt instructs Claude to treat tagged content as untrusted. |
| Long input abuse | `session_answers.answer` is constrained to 2,000 characters at DB level (`CHECK`) and Zod schema level. Maximum 30 answers per session. |
| Cost explosion | Anthropic and OpenAI account-level spend limits are set in their respective dashboards. `ai_usage_log` enables alerting when any user's 24-hour cost exceeds a threshold. |
| Generation spam | `rate-limit.ts` middleware enforces 20 generation jobs per user per 24 hours. |

### Security Checklist

```
Authentication
[ ] requireAuth middleware on every route
[ ] supabase.auth.getUser() used (not just JWT decode)
[ ] Tokens stored in httpOnly cookies on frontend, not localStorage

Authorization
[ ] Every query: WHERE user_id = ctx.var.user.id
[ ] All direct-ID endpoints verify ownership before returning
[ ] Supabase RLS enabled on all tables

AI
[ ] User input in <user_input> XML tags in all prompts
[ ] Answer length limited to 2000 chars in Zod + DB CHECK constraint
[ ] Daily generation rate limit enforced (20/day via DB count)
[ ] Anthropic spend limit configured in dashboard
[ ] OpenAI spend limit configured in dashboard

Data
[ ] Env vars encrypted (AES-256-GCM) before storage
[ ] ENCRYPTION_KEY never in database or logs
[ ] SUPABASE_SERVICE_ROLE_KEY not in NEXT_PUBLIC_ vars
[ ] ANTHROPIC_API_KEY not in NEXT_PUBLIC_ vars
[ ] No PII in structured error responses

Transport
[ ] HTTPS enforced (Railway auto-TLS)
[ ] Helmet headers on all responses
[ ] CORS: Vercel origin + localhost only
[ ] No credentials in URL query params
```

---

## Backend Folder Structure

```
xenysis-api/
├── src/
│   │
│   ├── index.ts                           ← Hono app entry point; route composition
│   │
│   ├── agents/                            ← All AI agent modules
│   │   ├── base/
│   │   │   ├── agent.interface.ts         ← Agent<TInput, TOutput> interface
│   │   │   ├── events.ts                  ← GenerationEvent union type
│   │   │   ├── runner.ts                  ← AgentRunner (retry loop, job state, SSE forwarding)
│   │   │   └── utils.ts                   ← trackUsage(), logActivity()
│   │   │
│   │   ├── opportunity-agent/
│   │   │   ├── index.ts                   ← OpportunityAgent
│   │   │   ├── prompt.ts                  ← PROMPT_VERSION, buildSystemPrompt(), buildUserMessage()
│   │   │   ├── context-builder.ts         ← buildOpportunityInput(db, startupId, sessionId)
│   │   │   └── persist.ts                 ← createOrUpdateAssessment(db, ...)
│   │   │
│   │   ├── blueprint-agent/
│   │   │   ├── index.ts
│   │   │   ├── prompt.ts
│   │   │   ├── context-builder.ts
│   │   │   └── persist.ts
│   │   │
│   │   └── workspace-agent/
│   │       ├── index.ts
│   │       ├── prompt.ts
│   │       ├── context-builder.ts
│   │       ├── graph-normalizer.ts        ← Post-process: validate connectors, normalize layout
│   │       └── persist.ts
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   │   ├── enums.ts
│   │   │   │   ├── profiles.ts
│   │   │   │   ├── startups.ts
│   │   │   │   ├── founder-sessions.ts
│   │   │   │   ├── artifacts.ts           ← assessments, blueprints, workspaces, previews
│   │   │   │   ├── generation.ts          ← generation_jobs, ai_usage_log
│   │   │   │   ├── deploy.ts
│   │   │   │   ├── activity.ts
│   │   │   │   └── index.ts               ← re-exports all tables + Drizzle relations()
│   │   │   └── index.ts                   ← Drizzle client (pooler URL)
│   │   │
│   │   ├── contracts/                     ← Artifact Zod schemas and TypeScript types
│   │   │   ├── opportunity-assessment.ts
│   │   │   ├── startup-blueprint.ts
│   │   │   ├── workspace-graph.ts
│   │   │   └── preview-context.ts
│   │   │
│   │   ├── ai/
│   │   │   └── client.ts                  ← Anthropic SDK singleton
│   │   │
│   │   └── crypto/
│   │       └── env-vars.ts                ← AES-256-GCM encrypt() and decrypt()
│   │
│   ├── middleware/
│   │   ├── auth.ts                        ← requireAuth: validates Supabase JWT, sets ctx.var.user
│   │   ├── validate.ts                    ← zValidator wrapper for Hono
│   │   └── rate-limit.ts                  ← generationRateLimit: DB count → 429 if exceeded
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   └── router.ts                  ← GET /auth/me
│   │   ├── startups/
│   │   │   ├── router.ts
│   │   │   └── health.ts                  ← Query startup_health view
│   │   ├── founder-sessions/
│   │   │   └── router.ts
│   │   ├── opportunity/
│   │   │   └── router.ts
│   │   ├── blueprint/
│   │   │   └── router.ts
│   │   ├── workspace/
│   │   │   └── router.ts
│   │   ├── generation/
│   │   │   ├── router.ts                  ← /generate (full pipeline), /jobs
│   │   │   └── orchestrator.ts            ← Creates parent + child jobs, sequences execution
│   │   ├── deploy/
│   │   │   └── router.ts
│   │   ├── activity/
│   │   │   └── router.ts
│   │   └── usage/
│   │       └── router.ts
│   │
│   └── types/
│       └── hono.ts                        ← HonoEnv type: ctx.var.user shape
│
├── drizzle/
│   └── migrations/                        ← SQL migration files committed to git
│
├── drizzle.config.ts
├── Dockerfile
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Development Roadmap

### Sprint 1 — Foundation

**Goal:** API server running, full database schema deployed, authentication wired end-to-end. No AI calls yet.

**Deliverables:**
- `xenysis-api/` repo scaffolded: Hono + Drizzle + TypeScript + Zod
- Docker Compose for local PostgreSQL
- Complete Drizzle schema in `src/lib/db/schema/` matching this specification
- All migrations generated (`drizzle-kit generate`) and applied (`drizzle-kit migrate`)
- `startup_health` view created
- `requireAuth` middleware (Supabase JWT → `ctx.var.user`)
- `GET /api/v1/auth/me` endpoint
- Frontend `src/services/auth/client.ts`: real Supabase client enabled
- Frontend `src/services/auth/use-auth.ts`: real session subscription
- Frontend `src/lib/api.ts`: `Authorization: Bearer` injected from Supabase session token

**Dependencies:** None.

**Done when:** A user can sign in through the frontend and `GET /auth/me` returns their profile. Zero mocks involved in the auth flow.

---

### Sprint 2 — Startups + Sessions

**Goal:** Users can create startups, run founder sessions, and have their answers persisted. AI chat is live.

**Deliverables:**
- Anthropic SDK client: `src/lib/ai/client.ts`
- Agent base infrastructure: `runner.ts`, `events.ts`, `utils.ts`
- Startup CRUD endpoints — `fetchStartups()` mock replaced in frontend
- Founder session endpoints: create, get, post answers
- Session AI chat stream (`POST /sessions/:id/messages` → SSE Claude turns)
- `activity_log` writes: startup created, session started, session completed
- Seed script for local development data

**Dependencies:** Sprint 1 complete.

**Done when:** Founder session answers are stored in `session_answers`. AI chat responses stream live from Claude. The dashboard shows real startups from the database.

---

### Sprint 3 — OpportunityAgent

**Goal:** Opportunity Assessment is generated by a real AI agent, versioned, and rendered in the UI. This sprint validates the entire AI generation pipeline pattern that Sprints 4 and 5 replicate.

**Deliverables:**
- `OpportunityAgent` fully implemented
- Claude `tool_use` pipeline with `OpportunityAssessmentSchema` validation
- Retry wrapper with Zod error feedback on failure
- `ai_usage_log` writes on every Claude call
- Version management: insert version, flip `is_current` in transaction
- `POST /opportunity/generate` → job creation → `runAgent()` → SSE stream
- `GET /opportunity`, versions, and version-by-id endpoints
- `GET /jobs/:id` and `GET /jobs/:id/stream` with reconnect replay
- Frontend `SummaryStep.tsx`: hardcoded assessment replaced with API data
- `activity_log` write: opportunity assessment generated (version N)

**Dependencies:** Sprint 2 complete.

**Done when:** User completes a founder session, triggers generation, watches real SSE progress stages, and sees a Claude-generated assessment. The `opportunity_assessment_versions` table has a row with `is_current = TRUE`.

---

### Sprint 4 — BlueprintAgent

**Goal:** Blueprint is generated from the opportunity assessment, versioned, and served.

**Deliverables:**
- `BlueprintAgent` fully implemented (same pattern as Sprint 3)
- `POST /blueprint/generate` → SSE stream
- Blueprint endpoints (current + versions)
- Frontend: blueprint section of summary screen replaced with real API data
- Opportunity assessment passed as full context to blueprint prompt

**Dependencies:** Sprint 3 complete.

**Done when:** Blueprint is generated from a real assessment, stored in `blueprint_versions` with `is_current = TRUE`, and rendered on the frontend.

---

### Sprint 5 — WorkspaceAgent + Deploy + Polish

**Goal:** Full generation pipeline complete. Workspace canvas is real. Deploy module is wired. All command center data is live.

**Deliverables:**
- `WorkspaceAgent` with graph seeding, normalization, and full validation
- `POST /workspace/generate` → SSE with all 7 stage events
- Workspace endpoints (current + versions + asset config patch)
- Preview context generation triggered after workspace persistence
- `GET /preview-context` endpoint
- `POST /startups/:id/generate` — full pipeline (parent + 3 child jobs sequentially)
- Frontend: generation progress screen driven by real SSE events
- Frontend: workspace canvas from `GET /workspace`
- Frontend: preview screen from `GET /preview-context`
- Deploy module: environment CRUD, encrypted env vars, release history, stubbed deploy action
- `GET /health` (computed from view), `GET /activity` (cursor-paginated)
- AI usage endpoints (`/usage/summary`, `/usage/log`)

**Dependencies:** Sprints 3 and 4 complete.

**Done when:** A user can complete the full journey — idea → session → full generation → workspace canvas — without touching any mock. AI usage and activity are tracked throughout.

---

## Development Rules

### Rules Future Claude Conversations Must Follow

These rules are architectural constraints. They are not preferences or suggestions. Do not override them without an explicit architecture revision approved by the project owner.

---

**Rule 1: No GraphQL.**
REST + SSE is the API transport. This decision is final for MVP. GraphQL adds schema registry, resolver complexity, and N+1 risk for no benefit at this data shape.

**Rule 2: No microservices.**
The entire backend lives in `xenysis-api/`. Service boundaries are expressed as module folders (`src/modules/`), not network boundaries. Split into services only when a specific scaling bottleneck demands it.

**Rule 3: No Kubernetes, ECS, or container orchestration.**
Railway manages deployment. Introduce orchestration only when horizontal scaling is required and justified by traffic metrics.

**Rule 4: No event sourcing.**
`activity_log` is a chronological audit log. `generation_jobs` is a job state tracker. Neither implies an event-sourced architecture. Do not introduce event stores, projections, or event replay patterns.

**Rule 5: No Redis unless specifically required.**
Redis is acceptable only if one of these conditions is true: (a) generation jobs consistently exceed 45 seconds and a BullMQ queue is needed; (b) rate limiting requires distributed state across multiple API instances; (c) health computation exceeds 50ms at production load. Do not add Redis for caching convenience.

**Rule 6: Artifacts are the source of truth.**
Agents write artifacts. Route handlers read artifacts. Do not derive artifact content at request time. Do not store derived artifact content in non-artifact columns. `preview_contexts` exists precisely to avoid runtime derivation of the preview screen.

**Rule 7: Artifacts are never mutated.**
A new generation always creates a new version row with `is_current = TRUE`. The previous current row is set to `is_current = FALSE`. Neither old versions nor parent rows are ever deleted.

**Rule 8: JSONB is for documents only.**
Use JSONB for: artifact content, generation stage states, activity event metadata. Do not use JSONB for any field that appears in a `WHERE` clause, `ORDER BY`, or join. If you find yourself writing `WHERE content->>'status' = 'active'`, that field must become a normalized column.

**Rule 9: `startup_health` is a view, never a table.**
Do not create a `startup_health` table. Do not cache health scores in any column. If the view becomes slow at production scale, create a PostgreSQL materialized view and refresh it on a schedule. Never introduce a sync pattern between health state and the tables that compute it.

**Rule 10: Agents own prompts.**
Prompt construction lives in `src/agents/<agent-name>/prompt.ts`. Route handlers, orchestrators, and runners do not construct prompts. If a prompt needs to change, change only the relevant agent module.

**Rule 11: Agents own artifact persistence.**
The `persist.ts` file in each agent module writes to the database. Route handlers do not insert artifact rows directly.

**Rule 12: The AgentRunner owns job state.**
`status`, `progress`, `stages`, `started_at`, `completed_at`, and `attempt_number` on `generation_jobs` are updated only by `src/agents/base/runner.ts`. Agents do not update job records. Route handlers do not update job records after handing off to the runner.

**Rule 13: New agents are new modules.**
`src/agents/research-agent/`, `src/agents/critic-agent/`, etc. are created as new directories. They follow the same interface as existing agents. Adding a new agent does not require changes to existing agents, the `generation_jobs` table schema, or any API endpoint.

**Rule 14: Sub-agents are private to their parent.**
If `OpportunityAgent` delegates to `ResearchAgent` internally, `ResearchAgent` is a private implementation detail inside `src/agents/opportunity-agent/`. It writes to `ai_usage_log` for every Claude call. It does not create `generation_jobs` rows.

**Rule 15: `ai_usage_log` is mandatory for every Claude call.**
No agent or utility may call the Anthropic API without calling `trackUsage()` immediately after receiving the response. AI cost visibility is non-negotiable.

**Rule 16: Zod validates all input at the boundary.**
All request bodies, path parameters, and query strings are validated with `zValidator` middleware before reaching handler logic. There are no unvalidated inputs inside handler functions.

**Rule 17: Every query enforces ownership.**
Every database query that returns user-owned data must include `WHERE user_id = ctx.var.user.id`. This applies to all entities in the ownership chain. No exceptions.

**Rule 18: Migrations are SQL files committed to git.**
Use `drizzle-kit generate` to produce SQL migration files. Never use `drizzle-kit push` in any environment other than local development during initial schema creation. Review migration SQL before applying to any shared environment.

**Rule 19: SSE endpoints are not proxied through Next.js.**
The frontend must call the Railway API URL directly for all SSE endpoints. Setting `NEXT_PUBLIC_API_URL` to the Railway URL is correct. Routing SSE through Next.js API routes is incorrect and will hit Vercel timeout limits.

**Rule 20: Preserve the artifact-driven architecture.**
Before adding any new feature, ask: what is the artifact? Who is the agent? Where is the version? If a feature produces meaningful AI output, it must produce a named, versioned, schema-validated artifact. Do not add AI capabilities as unversioned side effects.

---

## Open Questions

The following items are genuinely unresolved and require a decision before the relevant sprint begins.

**1. Session answer storage limit.**
The current constraint is 30 answers maximum per session. Is this sufficient for the intended conversation depth? A longer session produces better context but increases input token cost per generation. Decide before Sprint 2.

**2. Workspace coordinate system.**
The `WorkspaceGraph` stores `x`, `y`, `w`, `h` as raw numbers. What coordinate space do these represent? Pixels? Grid units? The `graph-normalizer.ts` in `WorkspaceAgent` needs a defined layout algorithm and boundary constraints before the workspace canvas can render accurately. Decide before Sprint 5.

**3. Preview context regeneration trigger.**
When a workspace is regenerated, the `preview_contexts` row is replaced. Should this happen inline within the workspace generation job, or as a separate child job with its own SSE events? The inline approach is simpler but hides preview generation from the progress UI. Decide before Sprint 5.

**4. Encryption key rotation.**
No key rotation strategy is currently documented. Before the first production deploy, a migration plan must exist for re-encrypting all `deploy_env_vars.value_encrypted` rows when the `ENCRYPTION_KEY` changes. This must be resolved before Sprint 5.
