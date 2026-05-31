@AGENTS.md


# Xenysis

## Product

Xenysis is an AI Technical Cofounder platform.

Users go from:

Idea
→ Founder Session
→ Startup Architecture
→ Workspace
→ Deployment

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

Marketing Layer
Founder Layer
Workspace Layer
Startup Layer

---

## Navigation

Global Rail:
- Dashboard
- Projects
- Billing
- Settings

Startup Sidebar:
- Workspace (primary — canvas OS, absorbs Architecture, Database, Pages, Workflows as asset types)
- Command Center (health dashboard, deployment status, AI activity)
- Deploy
- Logs
- Settings

Note: Architecture, Database, Pages, and Workflows are NOT sidebar sections.
They are asset nodeTypes rendered on the Workspace canvas and filtered via filter chips.