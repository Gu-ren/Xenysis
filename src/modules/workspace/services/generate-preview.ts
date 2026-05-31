import type { WorkspaceAsset } from '../types'

export interface AssetPreview {
  filePath: string
  language: string
  code: string
}

export function generateAssetPreview(asset: WorkspaceAsset): AssetPreview {
  switch (asset.nodeType) {
    case 'page':      return generatePagePreview(asset)
    case 'database':  return generateDatabasePreview(asset)
    case 'workflow':  return generateWorkflowPreview(asset)
    case 'system':    return generateSystemPreview(asset)
    case 'integration': return generateIntegrationPreview(asset)
    case 'api':       return generateApiPreview(asset)
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pascal(str: string) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase())
}

function snake(str: string) {
  return str.toLowerCase().replace(/\s+/g, '_')
}

// ── Page ──────────────────────────────────────────────────────────────────────

function generatePagePreview(asset: WorkspaceAsset): AssetPreview {
  const name = pascal(asset.title)
  const routePath = asset.route ?? `/${snake(asset.title)}`
  const folderSegments = routePath.replace(/^\//, '').replace(/\//g, '/') || 'index'

  const isAuth = asset.assetType === 'auth'
  const isBilling = asset.assetType === 'billing'

  const code = isAuth
    ? `'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/lib/auth'

export default function ${name}Page() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await authService.${name === 'Signup' ? 'register' : 'login'}({ email, password })
      router.push('/app/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <h1 className="text-xl font-semibold text-foreground">${asset.title}</h1>
        <p className="mt-1 text-sm text-muted">${asset.description}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading…' : '${asset.title}'}
          </Button>
        </form>
      </div>
    </div>
  )
}`
    : isBilling
      ? `import { Metadata } from 'next'
import { PricingTable } from '@/components/billing/pricing-table'
import { getSubscriptionPlans } from '@/lib/billing'

export const metadata: Metadata = {
  title: '${asset.title} — Pricing',
  description: '${asset.description}',
}

export default async function ${name}Page() {
  const plans = await getSubscriptionPlans()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-lg text-muted">
            Start free. Scale when you're ready.
          </p>
        </div>

        <PricingTable plans={plans} />

        <p className="mt-8 text-center text-xs text-muted/60">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </main>
  )
}`
      : `import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: '${asset.title}',
  description: '${asset.description}',
}

export default async function ${name}Page() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">${asset.title}</h1>
          <p className="text-sm text-muted mt-0.5">${asset.description}</p>
        </div>
      </div>

      {/* ${asset.purpose} */}
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted">
          Content for ${asset.title} loads here.
        </p>
      </div>
    </main>
  )
}`

  const filePath = routePath === '/'
    ? 'app/page.tsx'
    : `app${routePath}/page.tsx`

  return { filePath, language: 'tsx', code }
}

// ── Database ──────────────────────────────────────────────────────────────────

function generateDatabasePreview(asset: WorkspaceAsset): AssetPreview {
  const model = pascal(asset.title.replace(/s$/, ''))

  const schemasByTitle: Record<string, string> = {
    Users: `model User {
  id         String    @id @default(cuid())
  email      String    @unique
  name       String?
  avatarUrl  String?
  role       UserRole  @default(USER)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  lastActiveAt DateTime?

  sessions      Session[]
  subscriptions Subscription[]
}

enum UserRole {
  USER
  ADMIN
}`,
    Subscriptions: `model Subscription {
  id           String             @id @default(cuid())
  userId       String
  planId       String
  status       SubscriptionStatus @default(TRIALING)
  stripeId     String?            @unique
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  trialEndsAt  DateTime?
  canceledAt   DateTime?
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  user User @relation(fields: [userId], references: [id])
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
}`,
    Sessions: `model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  userAgent String?
  ipAddress String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}`,
  }

  const body = schemasByTitle[asset.title] ?? `model ${model} {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`

  const code = `// prisma/schema.prisma
// ${asset.purpose}

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${body}`

  return {
    filePath: `prisma/schema.prisma`,
    language: 'prisma',
    code,
  }
}

// ── Workflow ──────────────────────────────────────────────────────────────────

function generateWorkflowPreview(asset: WorkspaceAsset): AssetPreview {
  const name = pascal(asset.title.replace(/\s+/g, ''))

  const workflows: Record<string, string> = {
    Onboarding: `import { workflow, step } from '@/lib/workflows'
import { resend } from '@/lib/integrations/resend'
import { db } from '@/lib/db'

// Triggered immediately after signup
export const onboardingWorkflow = workflow('onboarding', {
  trigger: 'user.created',

  steps: [
    step('send-welcome-email', async ({ user }) => {
      await resend.emails.send({
        from: 'team@yourapp.com',
        to: user.email,
        subject: 'Welcome to YourApp 🎉',
        template: 'welcome',
        data: { name: user.name ?? 'there' },
      })
    }),

    step('create-default-workspace', async ({ user }) => {
      await db.workspace.create({
        data: {
          name: \`\${user.name ?? 'My'}'s Workspace\`,
          ownerId: user.id,
          plan: 'free',
        },
      })
    }),

    step('schedule-day3-nudge', async ({ user }) => {
      await workflow.schedule('nudge-day3', {
        userId: user.id,
        runAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
    }),
  ],
})`,
    Payment: `import { workflow, step } from '@/lib/workflows'
import { stripe } from '@/lib/integrations/stripe'
import { billingService } from '@/lib/billing'
import { resend } from '@/lib/integrations/resend'

// Triggered by Stripe webhook events
export const paymentWorkflow = workflow('payment', {
  trigger: 'stripe.webhook',
  events: [
    'customer.subscription.created',
    'customer.subscription.updated',
    'invoice.payment_failed',
    'invoice.payment_succeeded',
  ],

  steps: [
    step('sync-subscription', async ({ event }) => {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.subscription
      )
      await billingService.syncSubscription(subscription)
    }),

    step('send-receipt', async ({ event, user }) => {
      if (event.type === 'invoice.payment_succeeded') {
        await resend.emails.send({
          from: 'billing@yourapp.com',
          to: user.email,
          subject: 'Payment confirmed',
          template: 'receipt',
          data: { amount: event.data.object.amount_paid / 100 },
        })
      }
    }),

    step('handle-payment-failed', async ({ event, user }) => {
      if (event.type === 'invoice.payment_failed') {
        await billingService.markPastDue(user.id)
        await resend.emails.send({
          from: 'billing@yourapp.com',
          to: user.email,
          subject: 'Action required: Payment failed',
          template: 'payment-failed',
        })
      }
    }),
  ],
})`,
  }

  const code = workflows[asset.title] ?? `import { workflow, step } from '@/lib/workflows'

// ${asset.purpose}
export const ${name.charAt(0).toLowerCase() + name.slice(1)}Workflow = workflow('${snake(asset.title)}', {
  trigger: 'scheduled',
  cron: '0 9 * * *',

  steps: [
    step('run', async (ctx) => {
      // ${asset.description}
      console.log('Running ${asset.title} workflow', ctx)
    }),
  ],
})`

  return {
    filePath: `lib/workflows/${snake(asset.title)}.ts`,
    language: 'typescript',
    code,
  }
}

// ── System ────────────────────────────────────────────────────────────────────

function generateSystemPreview(asset: WorkspaceAsset): AssetPreview {
  const name = pascal(asset.title)

  const services: Record<string, string> = {
    'Auth Service': `import { SignJWT, jwtVerify } from 'jose'
import { db } from '@/lib/db'
import { hash, compare } from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const ISSUER = 'yourapp'
const AUDIENCE = 'yourapp:client'

export class AuthService {
  async register(email: string, password: string) {
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) throw new Error('Email already in use')

    const hashed = await hash(password, 12)
    const user = await db.user.create({
      data: { email, password: hashed },
    })

    return { user, token: await this.issueToken(user.id) }
  }

  async login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } })
    if (!user) throw new Error('Invalid credentials')

    const valid = await compare(password, user.password)
    if (!valid) throw new Error('Invalid credentials')

    await db.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    })

    return { user, token: await this.issueToken(user.id) }
  }

  async verify(token: string) {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    })
    return db.user.findUniqueOrThrow({ where: { id: payload.sub } })
  }

  private async issueToken(userId: string) {
    return new SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setExpirationTime('7d')
      .sign(JWT_SECRET)
  }
}

export const authService = new AuthService()`,

    'Billing Service': `import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export class BillingService {
  async createCheckoutSession(userId: string, priceId: string) {
    const user = await db.user.findUniqueOrThrow({ where: { id: userId } })

    return stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: \`\${process.env.NEXT_PUBLIC_URL}/app/dashboard?upgraded=1\`,
      cancel_url: \`\${process.env.NEXT_PUBLIC_URL}/pricing\`,
      metadata: { userId },
    })
  }

  async syncSubscription(stripeSubscription: Stripe.Subscription) {
    const userId = stripeSubscription.metadata.userId
    if (!userId) return

    await db.subscription.upsert({
      where: { stripeId: stripeSubscription.id },
      create: {
        userId,
        planId: stripeSubscription.items.data[0].price.id,
        stripeId: stripeSubscription.id,
        status: this.mapStatus(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
      update: {
        status: this.mapStatus(stripeSubscription.status),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    })
  }

  async markPastDue(userId: string) {
    await db.subscription.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'PAST_DUE' },
    })
  }

  private mapStatus(status: Stripe.Subscription.Status) {
    const map: Record<string, string> = {
      trialing: 'TRIALING',
      active: 'ACTIVE',
      past_due: 'PAST_DUE',
      canceled: 'CANCELED',
      unpaid: 'UNPAID',
    }
    return (map[status] ?? 'ACTIVE') as never
  }
}

export const billingService = new BillingService()`,
  }

  const code = services[asset.title] ?? `// lib/services/${snake(asset.title)}.ts
// ${asset.purpose}

export class ${name} {
  // ${asset.description}
  async initialize() {
    // Service initialization
  }
}

export const ${name.charAt(0).toLowerCase() + name.slice(1)} = new ${name}()`

  return {
    filePath: `lib/services/${snake(asset.title)}.ts`,
    language: 'typescript',
    code,
  }
}

// ── Integration ───────────────────────────────────────────────────────────────

function generateIntegrationPreview(asset: WorkspaceAsset): AssetPreview {
  const integrations: Record<string, { filePath: string; code: string }> = {
    Stripe: {
      filePath: 'lib/integrations/stripe.ts',
      code: `import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Webhook signature verification
export function constructWebhookEvent(
  body: string,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  return stripe.webhooks.constructEvent(body, signature, secret)
}

// Pricing table IDs (replace with actual Stripe Price IDs)
export const STRIPE_PRICES = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    annual:  process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    annual:  process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
  },
} as const`,
    },
    Resend: {
      filePath: 'lib/integrations/resend.ts',
      code: `import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = 'team@yourapp.com'
export const FROM_BILLING = 'billing@yourapp.com'

// Pre-defined email templates
export const EMAIL_TEMPLATES = {
  WELCOME:        'welcome-v1',
  RECEIPT:        'receipt-v1',
  PAYMENT_FAILED: 'payment-failed-v1',
  NUDGE_DAY3:     'nudge-day3-v1',
  NUDGE_DAY7:     'nudge-day7-v1',
} as const

// Type-safe email sender
export async function sendEmail<T extends keyof typeof EMAIL_TEMPLATES>(
  to: string,
  template: T,
  data: Record<string, unknown>
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: getSubject(template),
    react: undefined,  // Replace with your React Email component
    // @ts-expect-error — template data is validated at call sites
    data,
  })
}

function getSubject(template: string): string {
  const subjects: Record<string, string> = {
    'welcome-v1':        'Welcome to YourApp 🎉',
    'receipt-v1':        'Payment confirmed',
    'payment-failed-v1': 'Action required: Payment failed',
    'nudge-day3-v1':     'Getting started with YourApp',
    'nudge-day7-v1':     "We haven't seen you in a while",
  }
  return subjects[template] ?? 'YourApp notification'
}`,
    },
  }

  const result = integrations[asset.title] ?? {
    filePath: `lib/integrations/${snake(asset.title)}.ts`,
    code: `// lib/integrations/${snake(asset.title)}.ts
// ${asset.purpose}

// Add your ${asset.title} API key to .env.local:
// ${asset.title.toUpperCase().replace(/\s+/g, '_')}_API_KEY=your_key_here

export function create${pascal(asset.title)}Client() {
  const apiKey = process.env.${asset.title.toUpperCase().replace(/\s+/g, '_')}_API_KEY
  if (!apiKey) throw new Error('${asset.title} API key is not configured')
  // Initialize ${asset.title} SDK here
}

export const ${asset.title.toLowerCase().replace(/\s+/g, '')} = create${pascal(asset.title)}Client()`,
  }

  return { filePath: result.filePath, language: 'typescript', code: result.code }
}

// ── API ───────────────────────────────────────────────────────────────────────

function generateApiPreview(asset: WorkspaceAsset): AssetPreview {
  const name = pascal(asset.title)
  const routeSlug = snake(asset.title).replace(/_/g, '-')

  const code = `import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const bodySchema = z.object({
  // Define ${asset.title} request body here
})

// GET /api/${routeSlug}
export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // ${asset.purpose}
    const data = await db.${name.charAt(0).toLowerCase() + name.slice(1)}.findMany({
      where: { userId: session.user.id },
    })
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[${name} GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/${routeSlug}
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await req.json()
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const result = await db.${name.charAt(0).toLowerCase() + name.slice(1)}.create({
      data: { ...parsed.data, userId: session.user.id },
    })
    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error('[${name} POST]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}`

  return {
    filePath: `app/api/${routeSlug}/route.ts`,
    language: 'typescript',
    code,
  }
}
