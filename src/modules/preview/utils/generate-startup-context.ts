import type { WorkspaceGraph } from '@/modules/workspace/types'
import type { BlueprintSystem, StartupBlueprint } from '@/modules/founder-session/types'
import type {
  StartupPreviewContext,
  StartupCategory,
  StartupEntity,
  StartupApiEndpoint,
  StartupNavItem,
  StartupMetric,
  StartupFeature,
} from '../types'
import { generateDesignProfile } from './generate-design-profile'
import {
  saasEntities,
  healthcareEntities,
  fintechEntities,
  marketplaceEntities,
  devtoolEntities,
  aiToolEntities,
  socialEntities,
  ecommerceEntities,
} from './context-entities'
import {
  saasApis,
  healthcareApis,
  fintechApis,
  marketplaceApis,
  devtoolApis,
  aiToolApis,
  socialApis,
  ecommerceApis,
} from './context-api-endpoints'


export interface FounderSessionHint {
  idea?: string
  businessModel?: string
  detectedPattern?: string
  systems?: BlueprintSystem[]
}

// ── Classification ─────────────────────────────────────────────────────────────

function classify(corpus: string): StartupCategory {
  const s = corpus.toLowerCase()
  if (/health|care|patient|clinic|medical|doctor|hospital|therapy|wellness|pharma/.test(s))
    return 'healthcare'
  if (/fintech|finance|payment|bank|invest|trading|crypto|loan|mortgage|insurance/.test(s))
    return 'fintech'
  if (/marketplace|listing|buy.*sell|auction|classifi|e-commerce|vendor|two-sided/.test(s))
    return 'marketplace'
  if (/devtool|developer tool|monitoring|observ|deploy|infra|ci\/cd|log.*engineer|sre|ops/.test(s))
    return 'developer-tool'
  if (/\bai\b|llm|gpt|machine.?learning|nlp|generative|predict|automate.*ai/.test(s))
    return 'ai-tool'
  if (/social|community|network|creator|content.*share|follow|post.*platform/.test(s))
    return 'social'
  if (/ecommerce|e-commerce|store|shop|retail|product.*sell|inventory/.test(s))
    return 'ecommerce'
  return 'saas'
}

function toDomain(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '.app'
}

type ContextWithoutProfile = Omit<StartupPreviewContext, 'designProfile'>

// ── Blueprint-driven generation ────────────────────────────────────────────────
// These functions derive the full preview context from the Founder Session
// blueprint instead of generic category templates.

function systemToNavLabel(name: string): string {
  const n = name.toLowerCase()
  if (/subscription|billing|plan|payment|revenue/.test(n)) return 'Billing'
  if (/lead/.test(n)) return 'Leads'
  if (/property|listing/.test(n)) return 'Properties'
  if (/client(?!.*portal)/.test(n)) return 'Clients'
  if (/customer/.test(n)) return 'Customers'
  if (/team|staff/.test(n)) return 'Team'
  if (/agent/.test(n)) return 'Agents'
  if (/member/.test(n)) return 'Members'
  if (/user(?!.*portal)/.test(n)) return 'Users'
  if (/order/.test(n)) return 'Orders'
  if (/product|catalog|inventory/.test(n)) return 'Products'
  if (/report|analytic|insight/.test(n)) return 'Analytics'
  if (/message|chat|inbox/.test(n)) return 'Messages'
  if (/appoint|schedule|calendar/.test(n)) return 'Schedule'
  if (/patient/.test(n)) return 'Patients'
  if (/invoice/.test(n)) return 'Invoices'
  if (/portal/.test(n)) return 'Portal'
  if (/project/.test(n)) return 'Projects'
  if (/task/.test(n)) return 'Tasks'
  if (/workflow|automation/.test(n)) return 'Workflows'
  if (/setting|config/.test(n)) return 'Settings'
  return name
    .replace(/\s+(Management|Service|System|Activity|Access|Plans?|Center|Hub|Engine|Module)$/i, '')
    .trim() || name
}

function systemsToAppNav(systems: BlueprintSystem[]): StartupNavItem[] {
  const icons = ['⊞', '◈', '◎', '▣', '⊙']
  const items: StartupNavItem[] = [{ icon: '⊞', label: 'Dashboard' }]
  const seen = new Set(['dashboard'])

  for (const sys of systems) {
    if (items.length >= 5) break
    const label = systemToNavLabel(sys.name)
    const key = label.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      items.push({ icon: icons[items.length] ?? '◇', label })
    }
  }

  return items
}

function getSystemSubtitle(name: string): string {
  const n = name.toLowerCase()
  if (/lead/.test(n)) return 'Track and convert your pipeline'
  if (/property|listing/.test(n)) return 'Manage your full catalog'
  if (/client/.test(n)) return 'Stay close to every relationship'
  if (/customer/.test(n)) return 'Manage your customer base'
  if (/team|agent|staff/.test(n)) return 'Collaborate across your org'
  if (/billing|subscription|payment/.test(n)) return 'Manage revenue and plans'
  if (/portal/.test(n)) return 'Self-service for your clients'
  if (/analytic|report|insight/.test(n)) return 'Data-driven decisions'
  if (/patient/.test(n)) return 'Secure health records'
  if (/appoint|schedule/.test(n)) return 'Streamlined scheduling'
  if (/order/.test(n)) return 'End-to-end order management'
  if (/inventory|product/.test(n)) return 'Catalog and stock control'
  if (/message|chat/.test(n)) return 'Keep every conversation in sync'
  if (/workflow|automation/.test(n)) return 'Automate repetitive tasks'
  return 'Powered by Xenysis AI'
}

function systemsToFeatures(systems: BlueprintSystem[]): StartupFeature[] {
  return systems.slice(0, 3).map((sys) => ({
    label: sys.name,
    sub: getSystemSubtitle(sys.name),
  }))
}

function systemsToMetrics(systems: BlueprintSystem[]): StartupMetric[] {
  const metrics: StartupMetric[] = []

  for (const sys of systems) {
    if (metrics.length >= 3) break
    const n = sys.name.toLowerCase()
    if (/lead/.test(n))
      metrics.push({ label: 'New Leads', value: '247', delta: '+34', up: true })
    else if (/property|listing/.test(n))
      metrics.push({ label: 'Active Listings', value: '1,284', delta: '+89', up: true })
    else if (/client/.test(n))
      metrics.push({ label: 'Active Clients', value: '312', delta: '+28', up: true })
    else if (/customer/.test(n))
      metrics.push({ label: 'Active Customers', value: '1,841', delta: '+124', up: true })
    else if (/team|agent|staff/.test(n))
      metrics.push({ label: 'Team Performance', value: '94%', delta: '+3%', up: true })
    else if (/subscription|billing|revenue/.test(n))
      metrics.push({ label: 'MRR', value: '$24.8k', delta: '+12%', up: true })
    else if (/payment/.test(n))
      metrics.push({ label: 'Processed', value: '$84k', delta: '+18%', up: true })
    else if (/patient/.test(n))
      metrics.push({ label: 'Active Patients', value: '1,284', delta: '+67', up: true })
    else if (/appoint|schedule/.test(n))
      metrics.push({ label: 'Appointments', value: '341', delta: '+28', up: true })
    else if (/order/.test(n))
      metrics.push({ label: 'Orders', value: '512', delta: '+41', up: true })
    else if (/product|inventory/.test(n))
      metrics.push({ label: 'Active Products', value: '2,341', delta: '+156', up: true })
  }

  if (metrics.length === 0) metrics.push({ label: 'Active Users', value: '847', delta: '+34', up: true })
  if (metrics.length < 2) metrics.push({ label: 'MRR', value: '$12.4k', delta: '+18%', up: true })
  if (metrics.length < 3) metrics.push({ label: 'Churn', value: '2.1%', delta: '-0.3%', up: false })

  return metrics
}

function buildChartLabelFromSystems(systems: BlueprintSystem[]): string {
  const first = systems[0]?.name?.toLowerCase() ?? ''
  if (/lead/.test(first)) return 'Lead Pipeline Value'
  if (/property|listing/.test(first)) return 'Active Listings'
  if (/client|customer/.test(first)) return 'Active Clients'
  if (/revenue|billing|subscription/.test(first)) return 'Monthly Recurring Revenue'
  if (/order/.test(first)) return 'Order Volume'
  if (/patient/.test(first)) return 'Monthly Appointments'
  return 'Monthly Growth'
}

function systemToEntityName(name: string): string {
  const n = name.toLowerCase()
  if (/lead/.test(n)) return 'Lead'
  if (/property|listing/.test(n)) return 'Property'
  if (/client(?!.*portal)/.test(n)) return 'Client'
  if (/customer/.test(n)) return 'Customer'
  if (/team|agent/.test(n)) return 'Agent'
  if (/member/.test(n)) return 'Member'
  if (/subscription|billing/.test(n)) return 'Subscription'
  if (/payment/.test(n)) return 'Payment'
  if (/patient/.test(n)) return 'Patient'
  if (/appoint/.test(n)) return 'Appointment'
  if (/order/.test(n)) return 'Order'
  if (/product/.test(n)) return 'Product'
  if (/portal/.test(n)) return 'PortalUser'
  if (/invoice/.test(n)) return 'Invoice'
  if (/project/.test(n)) return 'Project'
  return name.split(' ')[0]
}

function buildEntityFields(
  systemNameLower: string,
  entityName: string,
): StartupEntity['fields'] {
  const base = [{ field: 'id', type: 'String', note: '@id @cuid' }]

  if (/lead/.test(systemNameLower))
    return [
      ...base,
      { field: 'name', type: 'String' },
      { field: 'email', type: 'String?' },
      { field: 'phone', type: 'String?' },
      { field: 'status', type: 'LeadStatus', note: '@default(NEW)' },
      { field: 'source', type: 'String?' },
      { field: 'agentId', type: 'String?' },
      { field: 'agent', type: 'Agent?' },
      { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
    ]

  if (/property|listing/.test(systemNameLower))
    return [
      ...base,
      { field: 'title', type: 'String' },
      { field: 'address', type: 'String' },
      { field: 'priceCents', type: 'Int' },
      { field: 'status', type: 'ListingStatus', note: '@default(ACTIVE)' },
      { field: 'bedrooms', type: 'Int?' },
      { field: 'bathrooms', type: 'Float?' },
      { field: 'sqft', type: 'Int?' },
      { field: 'agentId', type: 'String' },
      { field: 'agent', type: 'Agent' },
    ]

  if (/client(?!.*portal)/.test(systemNameLower))
    return [
      ...base,
      { field: 'name', type: 'String' },
      { field: 'email', type: 'String', note: '@unique' },
      { field: 'phone', type: 'String?' },
      { field: 'status', type: 'ClientStatus', note: '@default(ACTIVE)' },
      { field: 'agentId', type: 'String' },
      { field: 'agent', type: 'Agent' },
      { field: 'lastContactAt', type: 'DateTime?' },
      { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
    ]

  if (/team|agent/.test(systemNameLower))
    return [
      ...base,
      { field: 'name', type: 'String' },
      { field: 'email', type: 'String', note: '@unique' },
      { field: 'role', type: 'AgentRole', note: '@default(AGENT)' },
      { field: 'licenseNumber', type: 'String?' },
      { field: 'leads', type: 'Lead[]' },
      { field: 'clients', type: 'Client[]' },
      { field: 'properties', type: 'Property[]' },
      { field: 'joinedAt', type: 'DateTime', note: '@default(now)' },
    ]

  if (/subscription|billing/.test(systemNameLower))
    return [
      ...base,
      { field: 'userId', type: 'String' },
      { field: 'planId', type: 'String' },
      { field: 'status', type: 'SubStatus' },
      { field: 'stripeId', type: 'String?', note: '@unique' },
      { field: 'currentPeriodEnd', type: 'DateTime' },
      { field: 'canceledAt', type: 'DateTime?' },
    ]

  if (/patient/.test(systemNameLower))
    return [
      ...base,
      { field: 'mrn', type: 'String', note: '@unique' },
      { field: 'firstName', type: 'String' },
      { field: 'lastName', type: 'String' },
      { field: 'dateOfBirth', type: 'DateTime' },
      { field: 'appointments', type: 'Appointment[]' },
    ]

  if (/order/.test(systemNameLower))
    return [
      ...base,
      { field: 'customerId', type: 'String' },
      { field: 'totalCents', type: 'Int' },
      { field: 'status', type: 'OrderStatus', note: '@default(PENDING)' },
      { field: 'stripePaymentId', type: 'String?', note: '@unique' },
      { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
    ]

  return [
    ...base,
    { field: 'name', type: 'String' },
    { field: 'status', type: `${entityName}Status`, note: '@default(ACTIVE)' },
    { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
    { field: 'updatedAt', type: 'DateTime', note: '@updatedAt' },
  ]
}

function systemsToEntities(systems: BlueprintSystem[]): StartupEntity[] {
  return systems.slice(0, 5).map((sys) => {
    const entityName = systemToEntityName(sys.name)
    return {
      name: entityName,
      fields: buildEntityFields(sys.name.toLowerCase(), entityName),
    }
  })
}

function systemsToFrontendModules(systems: BlueprintSystem[]): string[] {
  const modules: string[] = ['Agent Workspace']
  const seen = new Set(['agent workspace'])

  for (const sys of systems) {
    const n = sys.name.toLowerCase()
    let label: string
    if (/portal/.test(n)) label = 'Client Portal'
    else if (/billing|subscription/.test(n)) label = 'Billing Center'
    else if (/analytic|report/.test(n)) label = 'Analytics Dashboard'
    else label = sys.name

    const key = label.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      modules.push(label)
    }
    if (modules.length >= 5) break
  }

  return modules
}

function systemsToBackendServices(systems: BlueprintSystem[]): string[] {
  const services: string[] = ['Auth Service']
  const seen = new Set(['auth service'])

  for (const sys of systems) {
    const n = sys.name.toLowerCase()
    let label: string
    if (/billing|subscription|payment/.test(n)) label = 'Billing Service'
    else if (/lead/.test(n)) label = 'Lead Service'
    else if (/property|listing/.test(n)) label = 'Property Service'
    else if (/client|customer/.test(n)) label = 'CRM Service'
    else if (/team|agent/.test(n)) label = 'Team Management'
    else if (/patient/.test(n)) label = 'Patient Service'
    else if (/order/.test(n)) label = 'Order Service'
    else if (/portal/.test(n)) continue
    else if (/setting|config/.test(n)) continue
    else label = sys.name.replace(/\s+(Management|System|Module)$/i, ' Service')

    if (!seen.has(label.toLowerCase())) {
      seen.add(label.toLowerCase())
      services.push(label)
    }
    if (services.length >= 4) break
  }

  services.push('Notification Service')
  return services.slice(0, 5)
}

function systemsToApiEndpoints(name: string, systems: BlueprintSystem[]): StartupApiEndpoint[] {
  const endpoints: StartupApiEndpoint[] = []

  for (const sys of systems) {
    if (endpoints.length >= 6) break
    const n = sys.name.toLowerCase()

    if (/lead/.test(n)) {
      endpoints.push(
        { method: 'GET', path: '/api/leads', summary: 'List leads with filters and pagination', responseExample: `{ "data": [{ "id": "lead_01", "name": "John Smith", "status": "NEW" }] }` },
        { method: 'POST', path: '/api/leads', summary: 'Create a new lead', requestExample: `{ "name": "Jane Doe", "email": "jane@co.com", "source": "website" }` },
        { method: 'PATCH', path: '/api/leads/:id', summary: 'Update lead status or assignment', requestExample: `{ "status": "CONTACTED", "agentId": "agent_01" }` },
      )
    } else if (/property|listing/.test(n)) {
      endpoints.push(
        { method: 'GET', path: '/api/properties', summary: 'List properties with search and filters', responseExample: `{ "data": [{ "id": "prop_01", "title": "3BR Modern Home", "priceCents": 85000000 }] }` },
        { method: 'POST', path: '/api/properties', summary: 'Create a new property listing', requestExample: `{ "title": "Modern Condo", "address": "123 Main St", "priceCents": 55000000 }` },
      )
    } else if (/client(?!.*portal)/.test(n)) {
      endpoints.push(
        { method: 'GET', path: '/api/clients', summary: 'List clients with activity summary', responseExample: `{ "data": [{ "id": "cli_01", "name": "Sarah Connor", "status": "ACTIVE" }] }` },
        { method: 'POST', path: '/api/clients', summary: 'Add a new client', requestExample: `{ "name": "Bob Wilson", "email": "bob@co.com", "agentId": "agent_01" }` },
      )
    } else if (/team|agent/.test(n)) {
      endpoints.push(
        { method: 'GET', path: '/api/team', summary: 'List team members and performance metrics', responseExample: `{ "data": [{ "id": "agent_01", "name": "Alice Chen", "activeListings": 12 }] }` },
        { method: 'POST', path: '/api/team', summary: 'Add a new team member', requestExample: `{ "name": "Tom Lee", "email": "tom@brokerage.com", "role": "AGENT" }` },
      )
    } else if (/billing|subscription/.test(n)) {
      endpoints.push(
        { method: 'GET', path: '/api/subscriptions/current', summary: 'Get the current subscription and usage', responseExample: `{ "plan": "PRO", "status": "ACTIVE", "currentPeriodEnd": "2026-06-30" }` },
        { method: 'POST', path: '/api/subscriptions/upgrade', summary: 'Upgrade or change the plan', requestExample: `{ "planId": "enterprise" }` },
      )
    } else if (/patient/.test(n)) {
      endpoints.push(
        { method: 'GET', path: '/api/patients', summary: 'List patients for the authenticated provider', responseExample: `{ "data": [{ "id": "pat_01", "mrn": "MRN-0042", "firstName": "Sarah" }] }` },
        { method: 'POST', path: '/api/patients', summary: 'Register a new patient', requestExample: `{ "firstName": "John", "lastName": "Doe", "dateOfBirth": "1985-03-14" }` },
      )
    } else if (/order/.test(n)) {
      endpoints.push(
        { method: 'GET', path: '/api/orders', summary: 'List orders with status filters', responseExample: `{ "data": [{ "id": "ord_01", "status": "SHIPPED", "totalCents": 5998 }] }` },
        { method: 'POST', path: '/api/orders', summary: 'Create a new order', requestExample: `{ "customerId": "cus_01", "items": [{ "productId": "prd_01", "quantity": 2 }] }` },
      )
    }
  }

  if (endpoints.length < 6) {
    endpoints.push({
      method: 'GET',
      path: '/api/analytics',
      summary: 'Performance metrics and KPIs',
      responseExample: `{ "mrr": 24800, "activeUsers": 312, "growth": 0.12 }`,
    })
  }

  return endpoints.slice(0, 6)
}

function buildBlueprintHero(
  name: string,
  blueprint: StartupBlueprint,
  systemNames: string[],
): StartupPreviewContext['hero'] {
  const vertical = blueprint.detectedPattern.includes('—')
    ? blueprint.detectedPattern.split('—')[1].trim()
    : blueprint.detectedPattern

  const corpus = (blueprint.detectedPattern + ' ' + systemNames.join(' ')).toLowerCase()
  const capList = systemNames
    .slice(0, 4)
    .map((s) => systemToNavLabel(s).toLowerCase())
    .join(', ')

  const subheadline = `${name} puts ${capList} in one workspace — so your team can focus on growth.`

  if (/real estate|brokerage|property/.test(corpus)) {
    return {
      badge: `${blueprint.businessModel} · Built for brokerages`,
      headline: 'Close more deals with\na CRM built for modern brokerages.',
      subheadline: `Manage ${capList} from one intelligent workspace.`,
      cta: 'Start free →',
      ctaSecondary: 'Request a demo',
    }
  }
  if (/lead|pipeline|sales crm/.test(corpus)) {
    return {
      badge: blueprint.businessModel,
      headline: 'Win more deals with\nan intelligent sales platform.',
      subheadline,
      cta: 'Start free →',
      ctaSecondary: 'See a demo',
    }
  }
  if (/health|patient|clinic|medical/.test(corpus)) {
    return {
      badge: `HIPAA Compliant · ${blueprint.businessModel}`,
      headline: 'Care, coordinated\nfrom one platform.',
      subheadline: `${name} connects patients, providers, and data on a single, intelligent platform.`,
      cta: 'Get started →',
      ctaSecondary: 'Request a demo',
    }
  }
  if (/marketplace|buy.*sell|two-sided/.test(corpus)) {
    return {
      badge: 'Verified · Secure payments',
      headline: `The ${vertical} marketplace\nyour community has been waiting for.`,
      subheadline,
      cta: 'Start selling →',
      ctaSecondary: 'Browse listings',
    }
  }
  if (/fintech|finance|payment|bank/.test(corpus)) {
    return {
      badge: `Bank-grade security · ${blueprint.businessModel}`,
      headline: 'Financial clarity,\nbuilt for your team.',
      subheadline,
      cta: 'Open your account →',
      ctaSecondary: 'See how it works',
    }
  }

  // Generic but vertical-aware
  const cleanVertical = vertical
    .replace(/\s+(Teams?|Platform|Tool|App|Solution|Software|Service)$/i, '')
    .trim()
  return {
    badge: blueprint.businessModel,
    headline: `The ${cleanVertical} platform\nyour team needs.`,
    subheadline,
    cta: 'Get started free →',
    ctaSecondary: 'Request a demo',
  }
}

function buildBlueprintTagline(blueprint: StartupBlueprint, systemNames: string[]): string {
  const corpus = (blueprint.detectedPattern + ' ' + systemNames.join(' ')).toLowerCase()
  if (/real estate|brokerage/.test(corpus)) return 'The CRM built for modern brokerages.'
  if (/lead|pipeline/.test(corpus)) return 'Close more deals, faster.'
  if (/health|medical|clinic/.test(corpus)) return 'Care, coordinated.'
  if (/marketplace/.test(corpus)) return 'Buy. Sell. Done.'
  if (/finance|payment|banking/.test(corpus)) return 'Money, moved intelligently.'
  const vertical = blueprint.detectedPattern.includes('—')
    ? blueprint.detectedPattern.split('—')[1].trim()
    : blueprint.detectedPattern
  return `The smarter way to manage ${vertical.toLowerCase()}.`
}

function buildMarketingNavFromBlueprint(blueprint: StartupBlueprint): string[] {
  const n = blueprint.detectedPattern.toLowerCase()
  if (/real estate|brokerage/.test(n)) return ['Features', 'For Teams', 'Pricing', 'About']
  if (/health|medical/.test(n)) return ['For Patients', 'For Providers', 'Pricing', 'About']
  if (/marketplace/.test(n)) return ['Browse', 'Sell', 'How it works', 'Pricing']
  if (/finance|payment/.test(n)) return ['Products', 'Security', 'Pricing', 'Business']
  return ['Features', 'Pricing', 'Docs', 'Blog']
}

function buildIntegrationsFromBlueprint(blueprint: StartupBlueprint): string[] {
  const n = blueprint.detectedPattern.toLowerCase()
  if (/real estate/.test(n)) return ['Stripe', 'Resend', 'Twilio', 'DocuSign']
  if (/health/.test(n)) return ['Stripe', 'Resend', 'Twilio', 'HealthKit']
  if (/marketplace/.test(n)) return ['Stripe Connect', 'Algolia', 'Resend', 'Cloudinary']
  if (/finance/.test(n)) return ['Stripe', 'Plaid', 'Resend', 'Twilio']
  return ['Stripe', 'Resend', 'Twilio', 'Slack']
}

function buildPlanNamesFromBlueprint(blueprint: StartupBlueprint): [string, string, string] {
  const n = blueprint.detectedPattern.toLowerCase()
  if (/real estate|brokerage/.test(n)) return ['Solo Agent', 'Team', 'Brokerage']
  if (/health|medical/.test(n)) return ['Solo Practice', 'Group Practice', 'Health System']
  if (/marketplace/.test(n)) return ['Free', 'Pro Seller', 'Business']
  if (/finance|payment/.test(n)) return ['Personal', 'Business', 'Enterprise']
  return ['Starter', 'Business', 'Enterprise']
}

function buildPlanPricesFromBlueprint(blueprint: StartupBlueprint): [string, string, string] {
  const n = blueprint.detectedPattern.toLowerCase()
  if (/real estate|brokerage/.test(n)) return ['$49', '$149', 'Custom']
  if (/health|medical/.test(n)) return ['$99', '$299', 'Custom']
  if (/marketplace/.test(n)) return ['$0', '$49', '$149']
  if (/finance|payment/.test(n)) return ['Free', '$29', 'Custom']
  return ['$49', '$149', 'Custom']
}

function buildPlanFeaturesFromSystems(
  systems: BlueprintSystem[],
): { starter: string[]; pro: string[]; enterprise: string[] } {
  const labels = systems.slice(0, 3).map((s) => systemToNavLabel(s.name))
  const primary = labels[0] ?? 'Core features'

  return {
    starter: [`Basic ${primary}`, 'Up to 5 users', 'Email support'],
    pro: [
      `Full ${primary}`,
      'Unlimited users',
      ...labels.slice(1).map((l) => `Full ${l}`),
      'Priority support',
    ],
    enterprise: ['Custom limits', 'SSO', 'SLA', 'Dedicated support', 'API access'],
  }
}

function buildContextFromBlueprint(
  graph: WorkspaceGraph,
  blueprint: StartupBlueprint,
): StartupPreviewContext {
  const name = graph.startupName
  const activeSystems = blueprint.systems.filter((s) => s.status !== 'pending')
  const systemNames = activeSystems.map((s) => s.name)

  // Classify from full blueprint corpus for design profile
  const corpus = [blueprint.businessModel, blueprint.detectedPattern, ...systemNames].join(' ')
  const category = classify(corpus)

  return {
    name,
    domain: toDomain(name),
    tagline: buildBlueprintTagline(blueprint, systemNames),
    category,
    designProfile: generateDesignProfile(category),
    hero: buildBlueprintHero(name, blueprint, systemNames),
    marketingNav: buildMarketingNavFromBlueprint(blueprint),
    features: systemsToFeatures(activeSystems),
    appNav: systemsToAppNav(activeSystems),
    metrics: systemsToMetrics(activeSystems),
    chartLabel: buildChartLabelFromSystems(activeSystems),
    entities: systemsToEntities(activeSystems),
    frontendModules: systemsToFrontendModules(activeSystems),
    backendServices: systemsToBackendServices(activeSystems),
    externalIntegrations: buildIntegrationsFromBlueprint(blueprint),
    apiEndpoints: systemsToApiEndpoints(name, activeSystems),
    planNames: buildPlanNamesFromBlueprint(blueprint),
    planPrices: buildPlanPricesFromBlueprint(blueprint),
    planFeatures: buildPlanFeaturesFromSystems(activeSystems),
  }
}

// ── Category content maps ──────────────────────────────────────────────────────

function buildContext(name: string, category: StartupCategory): ContextWithoutProfile {
  const domain = toDomain(name)

  switch (category) {
    case 'healthcare':
      return {
        name, domain, tagline: 'Care, coordinated.', category,
        hero: {
          badge: 'HIPAA Compliant · SOC 2 Type II',
          headline: 'Patient care, without\nthe paperwork.',
          subheadline: `${name} connects patients and providers on a single, intelligent platform. Coordinate care, manage appointments, and streamline billing — all in one place.`,
          cta: 'Get started free →',
          ctaSecondary: 'Request a demo',
        },
        marketingNav: ['For Patients', 'For Providers', 'Pricing', 'About'],
        features: [
          { label: 'Patient Portal', sub: 'Secure health records' },
          { label: 'Smart Scheduling', sub: 'Appointment management' },
          { label: 'Billing Automation', sub: 'Streamlined insurance claims' },
        ],
        appNav: [
          { icon: '⊞', label: 'Overview' },
          { icon: '◈', label: 'Patients' },
          { icon: '◎', label: 'Appointments' },
          { icon: '▣', label: 'Billing' },
        ],
        metrics: [
          { label: 'Active Patients', value: '1,284', delta: '+67', up: true },
          { label: 'Appointments', value: '341', delta: '+28', up: true },
          { label: 'Monthly Revenue', value: '$48k', delta: '+12%', up: true },
        ],
        chartLabel: 'Monthly Appointments',
        entities: healthcareEntities(),
        frontendModules: ['Patient Dashboard', 'Appointment Booking', 'Provider Portal', 'Billing Center', 'Medical Records'],
        backendServices: ['Auth Service', 'Patient Service', 'Scheduling Engine', 'Billing Service', 'Notification Service'],
        externalIntegrations: ['Stripe', 'Twilio', 'Resend', 'HealthKit'],
        apiEndpoints: healthcareApis(name),
        planNames: ['Solo Practice', 'Group Practice', 'Health System'],
        planPrices: ['$99', '$299', 'Custom'],
        planFeatures: {
          starter: ['Up to 50 patients', 'Basic scheduling', 'Email support'],
          pro: ['Unlimited patients', 'Advanced billing', 'Priority support', 'EHR integrations'],
          enterprise: ['White-label', 'HIPAA BAA', 'SLA', 'Custom integrations'],
        },
      }

    case 'fintech':
      return {
        name, domain, tagline: 'Money, moved intelligently.', category,
        hero: {
          badge: 'Bank-grade security · SOC 2 Type II',
          headline: 'Financial clarity,\nat last.',
          subheadline: `${name} gives individuals and businesses a smarter way to manage, move, and grow their money — with real-time visibility at every step.`,
          cta: 'Open your account →',
          ctaSecondary: 'See how it works',
        },
        marketingNav: ['Products', 'Security', 'Pricing', 'Business'],
        features: [
          { label: 'Smart Accounts', sub: 'Real-time balance tracking' },
          { label: 'Instant Transfers', sub: 'Move money in seconds' },
          { label: 'Spend Analytics', sub: 'AI-powered insights' },
        ],
        appNav: [
          { icon: '⊞', label: 'Overview' },
          { icon: '◈', label: 'Accounts' },
          { icon: '▣', label: 'Transactions' },
          { icon: '◎', label: 'Analytics' },
        ],
        metrics: [
          { label: 'Assets Under Mgmt', value: '$2.4M', delta: '+8%', up: true },
          { label: 'Transactions', value: '12,481', delta: '+1.2k', up: true },
          { label: 'MRR', value: '$8.2k', delta: '+14%', up: true },
        ],
        chartLabel: 'Transaction Volume',
        entities: fintechEntities(),
        frontendModules: ['Account Dashboard', 'Transaction History', 'Transfer Flow', 'Analytics', 'Card Management'],
        backendServices: ['Auth Service', 'Ledger Service', 'Payment Processor', 'Fraud Detection', 'Analytics Engine'],
        externalIntegrations: ['Stripe', 'Plaid', 'Resend', 'Twilio'],
        apiEndpoints: fintechApis(name),
        planNames: ['Personal', 'Business', 'Enterprise'],
        planPrices: ['Free', '$29', 'Custom'],
        planFeatures: {
          starter: ['1 account', 'Basic transfers', '5 cards'],
          pro: ['5 accounts', 'Bulk payments', 'Spend analytics', 'Priority support'],
          enterprise: ['Unlimited accounts', 'Custom limits', 'API access', 'Dedicated support'],
        },
      }

    case 'marketplace':
      return {
        name, domain, tagline: 'Buy. Sell. Done.', category,
        hero: {
          badge: 'Verified sellers · Secure payments',
          headline: 'The market built\nfor trust.',
          subheadline: `${name} makes buying and selling effortless. List in minutes, reach thousands of buyers, and get paid securely — every time.`,
          cta: 'Start selling →',
          ctaSecondary: 'Browse listings',
        },
        marketingNav: ['Browse', 'Sell', 'How it works', 'Pricing'],
        features: [
          { label: 'Verified Listings', sub: 'AI-reviewed quality' },
          { label: 'Secure Payments', sub: 'Escrow protection' },
          { label: 'Instant Payouts', sub: 'Settled within 24h' },
        ],
        appNav: [
          { icon: '⊞', label: 'Overview' },
          { icon: '◈', label: 'Listings' },
          { icon: '▣', label: 'Orders' },
          { icon: '⊙', label: 'Sellers' },
        ],
        metrics: [
          { label: 'Gross Merch. Value', value: '$84k', delta: '+23%', up: true },
          { label: 'Active Listings', value: '2,341', delta: '+156', up: true },
          { label: 'Orders', value: '512', delta: '+41', up: true },
        ],
        chartLabel: 'Gross Merchandise Value',
        entities: marketplaceEntities(),
        frontendModules: ['Browse / Search', 'Listing Detail', 'Seller Dashboard', 'Order Management', 'Checkout'],
        backendServices: ['Auth Service', 'Listing Service', 'Order Service', 'Payment Processor', 'Search Engine'],
        externalIntegrations: ['Stripe Connect', 'Algolia', 'Resend', 'Cloudinary'],
        apiEndpoints: marketplaceApis(name),
        planNames: ['Free', 'Pro Seller', 'Business'],
        planPrices: ['$0', '$49', '$149'],
        planFeatures: {
          starter: ['5 listings', 'Standard fees', 'Basic analytics'],
          pro: ['Unlimited listings', 'Reduced fees', 'Advanced analytics', 'Priority placement'],
          enterprise: ['White-label', 'Custom fees', 'API access', 'Dedicated support'],
        },
      }

    case 'developer-tool':
      return {
        name, domain, tagline: 'Visibility for engineering teams.', category,
        hero: {
          badge: 'Built for engineers · SOC 2',
          headline: 'Ship with confidence.',
          subheadline: `${name} gives engineering teams real-time visibility into every service, deploy, and incident — before your users notice anything is wrong.`,
          cta: 'Start monitoring →',
          ctaSecondary: 'View demo',
        },
        marketingNav: ['Features', 'Docs', 'Pricing', 'Changelog'],
        features: [
          { label: 'Real-time Alerts', sub: 'P99 latency & error rates' },
          { label: 'Deploy Tracking', sub: 'Every commit, traced' },
          { label: 'Incident Response', sub: 'Automated runbooks' },
        ],
        appNav: [
          { icon: '⊞', label: 'Overview' },
          { icon: '◈', label: 'Services' },
          { icon: '◎', label: 'Incidents' },
          { icon: '▣', label: 'Deploys' },
        ],
        metrics: [
          { label: 'Uptime', value: '99.98%', delta: '+0.01%', up: true },
          { label: 'Open Incidents', value: '3', delta: '-5', up: true },
          { label: 'MRR', value: '$18.4k', delta: '+22%', up: true },
        ],
        chartLabel: 'Error Rate (p99)',
        entities: devtoolEntities(),
        frontendModules: ['Service Map', 'Incident Timeline', 'Deploy Feed', 'Alert Rules', 'Team Settings'],
        backendServices: ['Auth Service', 'Metrics Ingestion', 'Alert Engine', 'Incident Manager', 'Notification Service'],
        externalIntegrations: ['PagerDuty', 'Slack', 'GitHub', 'Datadog'],
        apiEndpoints: devtoolApis(name),
        planNames: ['Hobby', 'Team', 'Enterprise'],
        planPrices: ['Free', '$79', 'Custom'],
        planFeatures: {
          starter: ['3 services', '7-day retention', 'Email alerts'],
          pro: ['Unlimited services', '90-day retention', 'Slack + PagerDuty', 'SLA monitoring'],
          enterprise: ['Unlimited', 'Custom retention', 'SSO', 'SLA', 'Audit logs'],
        },
      }

    case 'ai-tool':
      return {
        name, domain, tagline: 'Intelligence, applied.', category,
        hero: {
          badge: 'Powered by GPT-4 · Production-ready',
          headline: 'AI that actually\nworks.',
          subheadline: `${name} brings production-grade AI to your workflow. Connect your data, define your rules, and let the model do the heavy lifting.`,
          cta: 'Start for free →',
          ctaSecondary: 'See examples',
        },
        marketingNav: ['Features', 'API', 'Pricing', 'Docs'],
        features: [
          { label: 'Smart Extraction', sub: 'Structured data from any source' },
          { label: 'Custom Pipelines', sub: 'Build AI workflows visually' },
          { label: 'API-first', sub: 'Integrate in minutes' },
        ],
        appNav: [
          { icon: '⊞', label: 'Overview' },
          { icon: '◈', label: 'Pipelines' },
          { icon: '◎', label: 'Outputs' },
          { icon: '▣', label: 'Usage' },
        ],
        metrics: [
          { label: 'API Requests', value: '48.2k', delta: '+34%', up: true },
          { label: 'Accuracy', value: '97.3%', delta: '+1.2%', up: true },
          { label: 'MRR', value: '$6.8k', delta: '+41%', up: true },
        ],
        chartLabel: 'API Requests / Day',
        entities: aiToolEntities(),
        frontendModules: ['Pipeline Builder', 'Output Inspector', 'API Playground', 'Usage Dashboard', 'Model Config'],
        backendServices: ['Auth Service', 'Pipeline Runner', 'Model Router', 'Usage Tracker', 'Webhook Dispatcher'],
        externalIntegrations: ['OpenAI', 'Anthropic', 'Stripe', 'Resend'],
        apiEndpoints: aiToolApis(name),
        planNames: ['Starter', 'Growth', 'Enterprise'],
        planPrices: ['$0', '$49', 'Custom'],
        planFeatures: {
          starter: ['500 req/mo', '2 pipelines', 'Community support'],
          pro: ['50k req/mo', 'Unlimited pipelines', 'Webhooks', 'Priority support'],
          enterprise: ['Unlimited', 'Custom models', 'SSO', 'SLA', 'On-prem option'],
        },
      }

    case 'social':
      return {
        name, domain, tagline: 'Connect with what matters.', category,
        hero: {
          badge: 'Privacy-first · End-to-end encrypted',
          headline: 'Your community,\nyour way.',
          subheadline: `${name} is where real conversations happen. Build meaningful connections without the noise of mainstream platforms.`,
          cta: 'Join the community →',
          ctaSecondary: "See what's inside",
        },
        marketingNav: ['Community', 'Creators', 'Pricing', 'Blog'],
        features: [
          { label: 'Groups & Spaces', sub: 'Niche communities' },
          { label: 'Direct Messaging', sub: 'End-to-end encrypted' },
          { label: 'Creator Tools', sub: 'Monetize your audience' },
        ],
        appNav: [
          { icon: '⊞', label: 'Feed' },
          { icon: '◈', label: 'Groups' },
          { icon: '◎', label: 'Messages' },
          { icon: '▣', label: 'Profile' },
        ],
        metrics: [
          { label: 'Members', value: '24.1k', delta: '+2.3k', up: true },
          { label: 'Daily Active', value: '8,412', delta: '+18%', up: true },
          { label: 'Posts / Day', value: '1,284', delta: '+22%', up: true },
        ],
        chartLabel: 'Daily Active Users',
        entities: socialEntities(),
        frontendModules: ['Feed', 'Group Browser', 'Direct Messages', 'Creator Dashboard', 'Profile'],
        backendServices: ['Auth Service', 'Feed Engine', 'Messaging Service', 'Notification Service', 'Content Moderation'],
        externalIntegrations: ['Stripe', 'Resend', 'Stream', 'Cloudinary'],
        apiEndpoints: socialApis(name),
        planNames: ['Free', 'Creator', 'Community Pro'],
        planPrices: ['$0', '$19', '$79'],
        planFeatures: {
          starter: ['Join groups', 'DMs', 'Basic profile'],
          pro: ['Paid communities', 'Creator analytics', 'Custom domain', 'Priority support'],
          enterprise: ['White-label', 'SSO', 'Admin controls', 'Dedicated support'],
        },
      }

    case 'ecommerce':
      return {
        name, domain, tagline: 'Your store, supercharged.', category,
        hero: {
          badge: 'Powering 5,000+ stores',
          headline: 'Sell more,\nstress less.',
          subheadline: `${name} gives online stores the tools to grow — from product listings to checkout to fulfillment, all in one intelligent platform.`,
          cta: 'Launch your store →',
          ctaSecondary: 'See demo store',
        },
        marketingNav: ['Features', 'Pricing', 'Themes', 'Partners'],
        features: [
          { label: 'Smart Catalog', sub: 'AI-generated descriptions' },
          { label: '1-Click Checkout', sub: 'Reduce cart abandonment' },
          { label: 'Auto-fulfillment', sub: 'Automated shipping labels' },
        ],
        appNav: [
          { icon: '⊞', label: 'Overview' },
          { icon: '◈', label: 'Products' },
          { icon: '▣', label: 'Orders' },
          { icon: '⊙', label: 'Customers' },
        ],
        metrics: [
          { label: 'Revenue', value: '$34.8k', delta: '+28%', up: true },
          { label: 'Orders', value: '1,241', delta: '+89', up: true },
          { label: 'Conversion', value: '3.4%', delta: '+0.6%', up: true },
        ],
        chartLabel: 'Revenue',
        entities: ecommerceEntities(),
        frontendModules: ['Storefront', 'Product Pages', 'Cart & Checkout', 'Order Tracking', 'Customer Account'],
        backendServices: ['Auth Service', 'Product Service', 'Order Processor', 'Inventory Manager', 'Shipping Service'],
        externalIntegrations: ['Stripe', 'ShipStation', 'Resend', 'Cloudinary'],
        apiEndpoints: ecommerceApis(name),
        planNames: ['Basic', 'Growth', 'Scale'],
        planPrices: ['$29', '$79', '$299'],
        planFeatures: {
          starter: ['1 store', '100 products', 'Basic analytics'],
          pro: ['3 stores', 'Unlimited products', 'Abandoned cart recovery', 'Priority support'],
          enterprise: ['Unlimited stores', 'Custom checkout', 'B2B pricing', 'Dedicated support'],
        },
      }

    // saas (default)
    default:
      return {
        name, domain, tagline: 'The workspace that scales with you.', category: 'saas',
        hero: {
          badge: 'Trusted by 10,000+ teams',
          headline: 'Work smarter.\nShip faster.',
          subheadline: `${name} gives your team everything they need to coordinate, build, and ship — without the noise.`,
          cta: 'Start for free →',
          ctaSecondary: 'See how it works',
        },
        marketingNav: ['Features', 'Pricing', 'Docs', 'Blog'],
        features: [
          { label: 'Smart Workflows', sub: 'Automated task routing' },
          { label: 'Team Analytics', sub: 'Real-time insights' },
          { label: 'Integrations', sub: '100+ native connectors' },
        ],
        appNav: [
          { icon: '⊞', label: 'Overview' },
          { icon: '◈', label: 'Projects' },
          { icon: '◎', label: 'Analytics' },
          { icon: '♦', label: 'Team' },
        ],
        metrics: [
          { label: 'MRR', value: '$12.4k', delta: '+18%', up: true },
          { label: 'Active Users', value: '847', delta: '+34', up: true },
          { label: 'Churn', value: '2.1%', delta: '-0.3%', up: false },
        ],
        chartLabel: 'Monthly Recurring Revenue',
        entities: saasEntities(),
        frontendModules: ['Dashboard', 'Project Board', 'Team Inbox', 'Analytics', 'Settings'],
        backendServices: ['Auth Service', 'Project Service', 'Notification Service', 'Analytics Engine', 'Billing Service'],
        externalIntegrations: ['Stripe', 'Resend', 'GitHub', 'Slack'],
        apiEndpoints: saasApis(name),
        planNames: ['Starter', 'Pro', 'Enterprise'],
        planPrices: ['Free', '$49', 'Custom'],
        planFeatures: {
          starter: ['1 workspace', '5 projects', 'Community support'],
          pro: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'SSO'],
          enterprise: ['Custom contracts', 'SLA', 'Audit logs', 'Dedicated CSM'],
        },
      }
  }
}

// ── Public entry point ─────────────────────────────────────────────────────────

export function generateStartupContext(
  graph: WorkspaceGraph,
  hint: FounderSessionHint = {}
): StartupPreviewContext {
  // When the Founder Session has produced systems/capabilities, use them as
  // the primary source of truth to drive all preview content.
  if (hint.systems && hint.systems.length > 0) {
    const blueprint: StartupBlueprint = {
      businessModel: hint.businessModel ?? 'B2B SaaS',
      detectedPattern: hint.detectedPattern ?? hint.businessModel ?? 'SaaS',
      systems: hint.systems,
      architectureScore: 90,
      workflowConfidence: 'High',
    }
    return buildContextFromBlueprint(graph, blueprint)
  }

  // Fallback: classify from corpus and use category templates
  const corpus = [
    graph.startupName,
    hint.idea ?? '',
    hint.businessModel ?? '',
    hint.detectedPattern ?? '',
  ].join(' ')

  const category = classify(corpus)
  const ctx = buildContext(graph.startupName, category)
  return { ...ctx, designProfile: generateDesignProfile(category) }
}
