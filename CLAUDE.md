@AGENTS.md


# Xenysis

## Product

Xenysis is an AI Technical Cofounder.

Its purpose: turn startup ideas into startup blueprints.

User journey:

Landing Page → Sign Up / Login → Founder Session → Startup Blueprint

---

## Tech Stack

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- TanStack Query

---

## Design System

Typography:
- Geist

Theme:
- Dark First

Primary Color:
#4FFAB0

Primary Hover:
#44E5A9

Background:
#0A0A0A

Card:
#171717

Border:
#27272A

Foreground:
#FAFAFA

Muted:
#A1A1AA

Success:
#4FFAB0

Danger:
#EF4444

---

## Design Principles

Inspired by:
- Linear
- Vercel
- Cursor
- Notion

Rules:

- Dark mode by default
- Use Geist everywhere
- Use #4FFAB0 as the primary accent
- Minimalistic enterprise SaaS aesthetic
- Use borders instead of heavy shadows
- Avoid colorful gradients
- Avoid glassmorphism
- Use subtle glow only for active states
- Use 12px radius for cards and panels

---

## Application Layers

Marketing Layer — `(marketing)` route group
Founder Layer — `(founder)` route group

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Signup |
| `/auth/callback` | Auth callback |
| `/auth/confirm` | Auth confirmation |
| `/founder-session` | Founder Session (welcome + discovery) |
| `/session-summary` | Startup Blueprint |

---

## Navigation

Marketing Nav:
- Logo, Features, Pricing, Log In, Get Started

Founder Layer:
- Minimal header only (logo + session label)
- No sidebar, no rail

---

## Phase 1 Scope

Keep only what supports the journey:
Landing → Auth → Founder Session → Startup Blueprint

Do NOT add Dashboard, Workspace, Command Center, Deploy, Logs, Billing, Settings, or any generation pipelines to this branch.

The Startup Blueprint (`/session-summary`) uses static data. No backend generation in Phase 1.
