import type { Journey, JourneyContent } from "./types"

export const JOURNEY_CONTENT: Record<Journey, JourneyContent> = {
  startup: {
    hero: {
      headline: "Your AI technical cofounder.",
      subheadline: "Build companies, not just software.",
      body: "Turn startup ideas into validation-ready startup systems through AI-guided founder sessions.",
      ctaLabel: "Start Founder Session",
      ctaHref: "/signup?intent=founder-session",
    },
    session: {
      eyebrow: "01 / FOUNDER SESSION",
      headingLine1: "Describe the",
      headingLine2: "problem.",
      body: "AI-guided sessions transform raw ideas into validated startup systems — challenging your assumptions before you build.",
      pulseLabel: "SYSTEM MAP GENERATING",
      dialogue: [
        { id: "q1", speaker: "ai", text: "Who are your target users and what problem do they face daily?" },
        { id: "a1", speaker: "founder", text: "I want to help remote teams run async standups with AI summaries." },
        { id: "q2", speaker: "ai", text: "What's your business model — subscription, usage-based, or marketplace?" },
        { id: "a2", speaker: "founder", text: "Team Management, Async Standup, AI Digest, Notifications." },
        {
          id: "q3",
          speaker: "ai",
          text: "Market fit validated. 3 comparable products found. Differentiation: AI-native, async-first.",
        },
      ],
    },
    blueprint: {
      eyebrow: "02 / Blueprint",
      headingLine1: "Everything your startup needs.",
      headingLine2: "Assembled in one founder session.",
      body: "Six production-ready modules generated around your startup intent — not around code prompts.",
      nodeFounderLabel: "FOUNDER SESSION",
      nodeSystemLabel: "STARTUP BLUEPRINT",
    },
    workspace: {
      eyebrow: "03 / WORKSPACE",
      headingLine1: "See how your startup works.",
      headingLine2: "Refine systems before you ship.",
      badge: "WORKSPACE",
    },
    deploy: {
      eyebrow: "04 / Launch",
      headingLine1: "Ship in minutes.",
      headingLine2: "Not weeks.",
      body: "Zero-config CI/CD. Every startup ships with a production-ready pipeline — preview, test, and go live in one session.",
      panelLabel: "DEPLOYMENT PIPELINE",
    },
    testimonials: [
      {
        quote: "I stopped wasting weeks deciding what to build. Xenysis forced clarity before I wrote a single line.",
        author: "YC Applicant",
        role: "SOLO FOUNDER",
      },
      {
        quote: "It felt like having a technical cofounder who challenged every assumption.",
        author: "Bootstrapped Founder",
        role: "INDIE HACKER",
      },
      {
        quote: "Xenysis questioned my target user before I even asked. That alone saved me three months.",
        author: "First-Time Founder",
        role: "SOLO FOUNDER",
      },
    ],
    footerTagline: "Your AI technical cofounder. From idea to deployed product.",
    footerCtaLabel: "Start Founder Session",
    footerCtaHref: "/signup?intent=founder-session",
  },
  business: {
    hero: {
      headline: "Your AI CTO.",
      subheadline: "Transform your business with AI-powered strategy, architecture, and implementation.",
      body: "Turn business challenges into implementation-ready technical systems through AI-guided strategy sessions.",
      ctaLabel: "Start Business Session",
      ctaHref: "/signup?intent=business-session",
    },
    session: {
      eyebrow: "01 / BUSINESS SESSION",
      headingLine1: "Describe the",
      headingLine2: "opportunity.",
      body: "AI-guided sessions transform business challenges into validated technical strategy — challenging your assumptions before you invest.",
      pulseLabel: "STRATEGY MAP GENERATING",
      dialogue: [
        { id: "q1", speaker: "ai", text: "What business problem are you trying to solve, and who feels it most?" },
        { id: "a1", speaker: "founder", text: "I want to modernize how our operations team tracks inventory across locations." },
        { id: "q2", speaker: "ai", text: "What's the operating model — internal tool, customer-facing platform, or both?" },
        { id: "a2", speaker: "founder", text: "Internal Operations, Inventory Sync, Reporting Dashboard, Alerts." },
        {
          id: "q3",
          speaker: "ai",
          text: "Business fit validated. 3 comparable systems found. Differentiation: real-time sync, unified reporting.",
        },
      ],
    },
    blueprint: {
      eyebrow: "02 / Business Blueprint",
      headingLine1: "Everything your business needs.",
      headingLine2: "Assembled in one business session.",
      body: "Six production-ready modules generated around your business strategy — not around code prompts.",
      nodeFounderLabel: "BUSINESS SESSION",
      nodeSystemLabel: "BUSINESS BLUEPRINT",
    },
    workspace: {
      eyebrow: "03 / WORKSPACE",
      headingLine1: "See how your business works.",
      headingLine2: "Refine systems before you ship.",
      badge: "AI WORKSPACE",
    },
    deploy: {
      eyebrow: "04 / Implementation",
      headingLine1: "Implement in minutes.",
      headingLine2: "Not weeks.",
      body: "Zero-config CI/CD. Every business ships with a production-ready pipeline — preview, test, and go live in one session.",
      panelLabel: "DEPLOYMENT PIPELINE",
    },
    testimonials: [
      {
        quote: "Xenysis mapped our entire operations stack before our first planning meeting ended.",
        author: "Operations Director",
        role: "MID-MARKET BUSINESS",
      },
      {
        quote: "It felt like having a technical cofounder who understood our business, not just our codebase.",
        author: "VP of Strategy",
        role: "GROWING BUSINESS",
      },
      {
        quote: "Xenysis questioned our rollout plan before we even asked. That alone saved us a quarter.",
        author: "Business Owner",
        role: "SMB LEADER",
      },
    ],
    footerTagline: "Your AI CTO. From strategy to deployed system.",
    footerCtaLabel: "Start Business Session",
    footerCtaHref: "/signup?intent=business-session",
  },
}

export function getJourneyContent(journey: Journey | null | undefined): JourneyContent {
  return JOURNEY_CONTENT[journey ?? "startup"]
}
