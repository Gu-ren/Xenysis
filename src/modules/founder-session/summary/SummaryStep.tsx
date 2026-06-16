'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Users,
  Map,
  Layers,
  DollarSign,
  Target,
  Package,
  TrendingUp,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useFounderSessionStore } from '@/store/founder-session'

// ── Static Blueprint Data ─────────────────────────────────────────────────────

const BLUEPRINT = {
  productOverview: {
    tagline: 'Turn startup ideas into build-ready blueprints.',
    description:
      'An AI-powered platform that helps founders go from raw idea to structured startup blueprint — capturing problem, customer, solution, and go-to-market strategy through a guided discovery session.',
  },
  problem: {
    statement:
      'Founders struggle to translate abstract startup ideas into structured, actionable plans. The gap between ideation and execution causes months of wasted time, misaligned teams, and premature builds.',
    painPoints: [
      'No structured process to validate and clarify the idea',
      'Difficulty articulating the problem for co-founders and investors',
      'Building the wrong thing before validating core assumptions',
    ],
  },
  customer: {
    segment: 'Early-stage founders (pre-seed to seed)',
    description:
      'Technical and non-technical founders with a startup idea who need structure and clarity before writing a single line of code or pitching to investors.',
    characteristics: [
      'First-time or second-time founders',
      'Idea stage to pre-product',
      'Seeking structure and validation',
    ],
  },
  solution: {
    headline: 'AI-guided discovery session that produces a complete startup blueprint',
    pillars: [
      {
        label: 'Founder Session',
        description:
          'Structured AI conversation that extracts and clarifies the startup idea',
      },
      {
        label: 'Blueprint Generation',
        description:
          'Transforms session insights into a structured, actionable startup plan',
      },
      {
        label: 'Persona Mapping',
        description: 'Identifies and defines the target customer archetypes',
      },
    ],
  },
  businessModel: {
    type: 'SaaS',
    primary: 'Subscription — monthly or annual plans per founder',
    secondary: 'Usage-based credits for advanced blueprint generation',
    pricing: 'Freemium entry with paid tier for full blueprint access',
  },
  personas: [
    {
      name: 'The Technical Founder',
      description: 'Engineer with a great idea but no business structure',
      needs: 'Business model clarity, customer definition, go-to-market framing',
    },
    {
      name: 'The Domain Expert',
      description: 'Industry veteran who sees a clear problem but lacks startup experience',
      needs: 'Idea validation, structured plan, investor-ready narrative',
    },
    {
      name: 'The Solo Builder',
      description: 'Individual creator building their first product',
      needs: 'Focus, scope clarity, MVP boundaries',
    },
  ],
  userJourney: [
    { step: 1, label: 'Land', description: 'Founder discovers Xenysis on the landing page' },
    { step: 2, label: 'Sign Up', description: 'Creates an account in under 60 seconds' },
    { step: 3, label: 'Share Idea', description: 'Enters their startup idea to begin the session' },
    {
      step: 4,
      label: 'Discovery Session',
      description: 'AI conducts a structured founder interview',
    },
    {
      step: 5,
      label: 'Blueprint',
      description: 'Receives a complete, structured startup blueprint',
    },
  ],
  mvpScope: {
    in: [
      'Landing page with clear value proposition',
      'Signup and login with Supabase Auth',
      'Founder Session — AI-guided discovery chat',
      'Session memory and understanding engine',
      'Startup Blueprint — structured output',
    ],
    out: [
      'Workspace canvas and asset management',
      'Architecture generation',
      'Deploy pipeline',
      'Billing and subscription management',
      'Team collaboration features',
    ],
  },
  risks: [
    {
      title: 'AI response quality variance',
      severity: 'high',
      mitigation:
        'Structured prompts, session summaries, and understanding validation gates',
    },
    {
      title: 'Low session completion rate',
      severity: 'medium',
      mitigation:
        'Progressive conversation design with clear value signals at each step',
    },
    {
      title: 'Blueprint perceived as generic',
      severity: 'high',
      mitigation:
        'Deep personalization using founder memory extraction throughout the session',
    },
    {
      title: 'Conversion from free to paid',
      severity: 'medium',
      mitigation:
        'Deliver undeniable value in the free tier before introducing the paywall',
    },
  ],
} as const

// ── Primitives ────────────────────────────────────────────────────────────────

function Section({
  icon,
  label,
  children,
  className,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-6', className)}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-primary">{icon}</span>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function SummaryStep() {
  const router = useRouter()
  const { idea } = useFounderSessionStore()

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-16">

      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-[1100px] mx-auto px-6 h-11 flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Xenysis"
            width={26}
            height={26}
            className="rounded-lg"
            priority
          />
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">
            Xenysis
          </span>
          <div className="w-px h-4 bg-foreground/[0.07] shrink-0" />
          <span className="text-[11px] text-foreground/30 font-medium">Startup Blueprint</span>
          {idea && (
            <>
              <div className="w-px h-4 bg-foreground/[0.07] shrink-0 hidden md:block" />
              <span className="text-[11px] text-foreground/20 italic truncate max-w-[260px] hidden md:block">
                &ldquo;{idea}&rdquo;
              </span>
            </>
          )}
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-[5px] bg-primary/10 border border-primary/20 rounded-full text-[10px] font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              Blueprint Ready
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.main
        className="max-w-[1100px] mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >

        {/* Hero card */}
        <div
          className="relative rounded-2xl border border-primary/20 bg-background overflow-hidden mb-6"
          style={{
            boxShadow:
              '0 0 60px 0 rgba(79,250,176,0.05), inset 0 0 0 1px rgba(79,250,176,0.10)',
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-l-2xl" />
          <div className="pl-7 pr-6 pt-6 pb-6">
            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-semibold mb-2">
              Startup Blueprint
            </p>
            <h1 className="text-[30px] font-bold text-foreground tracking-tight leading-tight mb-2">
              Your foundation is ready.
            </h1>
            <p className="text-[13px] text-foreground/45 leading-relaxed max-w-[620px]">
              Based on your Founder Session, Xenysis has structured your startup idea into a
              complete blueprint — covering problem, customer, solution, business model, and MVP
              scope.
            </p>
          </div>
        </div>

        {/* Blueprint grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Product Overview */}
          <Section icon={<Package className="w-4 h-4" />} label="Product Overview">
            <p className="text-[14px] font-semibold text-foreground mb-2">
              {BLUEPRINT.productOverview.tagline}
            </p>
            <p className="text-[13px] text-foreground/50 leading-relaxed">
              {BLUEPRINT.productOverview.description}
            </p>
          </Section>

          {/* Problem */}
          <Section icon={<Target className="w-4 h-4" />} label="Problem">
            <p className="text-[13px] text-foreground/55 leading-relaxed mb-4">
              {BLUEPRINT.problem.statement}
            </p>
            <ul className="flex flex-col gap-2">
              {BLUEPRINT.problem.painPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-[2px]" />
                  <span className="text-[12px] text-foreground/50 leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Customer */}
          <Section icon={<Users className="w-4 h-4" />} label="Customer">
            <p className="text-[9px] text-foreground/25 uppercase tracking-widest font-semibold mb-1">
              Primary Segment
            </p>
            <p className="text-[14px] font-semibold text-foreground mb-3">
              {BLUEPRINT.customer.segment}
            </p>
            <p className="text-[13px] text-foreground/50 leading-relaxed mb-4">
              {BLUEPRINT.customer.description}
            </p>
            <ul className="flex flex-col gap-1.5">
              {BLUEPRINT.customer.characteristics.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-[12px] text-foreground/55">{c}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Solution */}
          <Section icon={<Layers className="w-4 h-4" />} label="Solution">
            <p className="text-[13px] font-semibold text-foreground mb-4">
              {BLUEPRINT.solution.headline}
            </p>
            <div className="flex flex-col gap-3">
              {BLUEPRINT.solution.pillars.map((pillar) => (
                <div key={pillar.label} className="pl-3 border-l border-primary/30">
                  <p className="text-[11px] font-semibold text-primary mb-0.5">{pillar.label}</p>
                  <p className="text-[12px] text-foreground/45 leading-snug">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Business Model */}
          <Section icon={<DollarSign className="w-4 h-4" />} label="Business Model">
            <div className="flex flex-col gap-4">
              {(
                [
                  { label: 'Model Type',       value: BLUEPRINT.businessModel.type },
                  { label: 'Primary Revenue',  value: BLUEPRINT.businessModel.primary },
                  { label: 'Secondary Revenue',value: BLUEPRINT.businessModel.secondary },
                  { label: 'Pricing Strategy', value: BLUEPRINT.businessModel.pricing },
                ] as const
              ).map((row) => (
                <div key={row.label}>
                  <p className="text-[9px] text-foreground/25 uppercase tracking-widest font-semibold mb-0.5">
                    {row.label}
                  </p>
                  <p className="text-[13px] text-foreground/65 font-medium">{row.value}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Personas */}
          <Section icon={<Users className="w-4 h-4" />} label="Personas">
            <div className="flex flex-col gap-4">
              {BLUEPRINT.personas.map((persona) => (
                <div
                  key={persona.name}
                  className="pb-4 border-b border-border last:border-b-0 last:pb-0"
                >
                  <p className="text-[13px] font-semibold text-foreground mb-0.5">
                    {persona.name}
                  </p>
                  <p className="text-[12px] text-foreground/45 mb-1.5">{persona.description}</p>
                  <p className="text-[11px] text-foreground/30">
                    <span className="text-[9px] text-foreground/20 uppercase tracking-widest font-semibold">
                      Needs:{' '}
                    </span>
                    {persona.needs}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* User Journey */}
          <Section icon={<Map className="w-4 h-4" />} label="User Journey">
            <div className="flex flex-col">
              {BLUEPRINT.userJourney.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 py-3 border-b border-border last:border-b-0"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-[1px]">
                    <span className="text-[10px] font-bold text-primary tabular-nums">
                      {item.step}
                    </span>
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground leading-none mb-1">
                      {item.label}
                    </p>
                    <p className="text-[12px] text-foreground/40 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* MVP Scope */}
          <Section icon={<CheckCircle2 className="w-4 h-4" />} label="MVP Scope">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[9px] text-foreground/25 uppercase tracking-widest font-semibold mb-3">
                  In Scope
                </p>
                <ul className="flex flex-col gap-2">
                  {BLUEPRINT.mvpScope.in.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-[2px]" />
                      <span className="text-[12px] text-foreground/60 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[9px] text-foreground/25 uppercase tracking-widest font-semibold mb-3">
                  Out of Scope
                </p>
                <ul className="flex flex-col gap-2">
                  {BLUEPRINT.mvpScope.out.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-3 h-[1px] bg-foreground/20 shrink-0 mt-[7px]" />
                      <span className="text-[12px] text-foreground/30 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Risks & Assumptions — full width */}
          <Section
            icon={<TrendingUp className="w-4 h-4" />}
            label="Risks & Assumptions"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BLUEPRINT.risks.map((risk) => (
                <div
                  key={risk.title}
                  className={cn(
                    'rounded-lg border p-4',
                    risk.severity === 'high'
                      ? 'border-amber-500/20 bg-amber-500/[0.04]'
                      : 'border-border bg-background',
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle
                      className={cn(
                        'w-3.5 h-3.5 shrink-0',
                        risk.severity === 'high' ? 'text-amber-400' : 'text-amber-600/60',
                      )}
                    />
                    <span className="text-[12px] font-semibold text-foreground/75 flex-1">
                      {risk.title}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-[0.06em] uppercase shrink-0',
                        risk.severity === 'high'
                          ? 'bg-amber-500/12 text-amber-400 border border-amber-500/20'
                          : 'bg-amber-950/40 text-amber-700/60 border border-amber-900/40',
                      )}
                    >
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-[12px] text-foreground/40 leading-snug">{risk.mitigation}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rotate-45 rounded-[2px]" />
            <span className="text-[11px] font-bold text-foreground/28 tracking-[0.12em] uppercase">
              Xenysis
            </span>
          </div>
          <button
            onClick={() => router.push('/founder-session?fresh=true')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-foreground/[0.04] transition-colors border border-foreground/12 rounded-xl text-[13px] font-semibold text-foreground/55"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Start New Session
          </button>
        </div>
      </motion.main>
    </div>
  )
}
