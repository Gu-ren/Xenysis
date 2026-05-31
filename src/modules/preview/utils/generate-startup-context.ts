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

// ── Entity schemas per category ────────────────────────────────────────────────

function saasEntities(): StartupEntity[] {
  return [
    {
      name: 'User',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'email', type: 'String', note: '@unique' },
        { field: 'name', type: 'String?' },
        { field: 'role', type: 'UserRole', note: '@default(MEMBER)' },
        { field: 'organizationId', type: 'String' },
        { field: 'lastActiveAt', type: 'DateTime?' },
        { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
    {
      name: 'Organization',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'name', type: 'String' },
        { field: 'slug', type: 'String', note: '@unique' },
        { field: 'plan', type: 'PlanTier', note: '@default(FREE)' },
        { field: 'members', type: 'User[]' },
        { field: 'projects', type: 'Project[]' },
        { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
    {
      name: 'Project',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'name', type: 'String' },
        { field: 'status', type: 'ProjectStatus' },
        { field: 'organizationId', type: 'String' },
        { field: 'ownerId', type: 'String' },
        { field: 'tasks', type: 'Task[]' },
        { field: 'updatedAt', type: 'DateTime', note: '@updatedAt' },
      ],
    },
    {
      name: 'Task',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'title', type: 'String' },
        { field: 'status', type: 'TaskStatus', note: '@default(TODO)' },
        { field: 'priority', type: 'Priority', note: '@default(MEDIUM)' },
        { field: 'assigneeId', type: 'String?' },
        { field: 'projectId', type: 'String' },
        { field: 'dueAt', type: 'DateTime?' },
      ],
    },
    {
      name: 'Subscription',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'organizationId', type: 'String' },
        { field: 'planId', type: 'String' },
        { field: 'status', type: 'SubStatus' },
        { field: 'stripeId', type: 'String?', note: '@unique' },
        { field: 'currentPeriodEnd', type: 'DateTime' },
      ],
    },
  ]
}

function healthcareEntities(): StartupEntity[] {
  return [
    {
      name: 'Patient',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'mrn', type: 'String', note: '@unique' },
        { field: 'firstName', type: 'String' },
        { field: 'lastName', type: 'String' },
        { field: 'dateOfBirth', type: 'DateTime' },
        { field: 'email', type: 'String?' },
        { field: 'phone', type: 'String?' },
        { field: 'insuranceId', type: 'String?' },
        { field: 'appointments', type: 'Appointment[]' },
      ],
    },
    {
      name: 'Provider',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'npi', type: 'String', note: '@unique' },
        { field: 'name', type: 'String' },
        { field: 'specialty', type: 'String' },
        { field: 'licenseState', type: 'String' },
        { field: 'appointments', type: 'Appointment[]' },
      ],
    },
    {
      name: 'Appointment',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'patientId', type: 'String' },
        { field: 'providerId', type: 'String' },
        { field: 'scheduledAt', type: 'DateTime' },
        { field: 'status', type: 'ApptStatus', note: '@default(SCHEDULED)' },
        { field: 'type', type: 'AppointmentType' },
        { field: 'notes', type: 'String?' },
      ],
    },
    {
      name: 'MedicalRecord',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'patientId', type: 'String' },
        { field: 'providerId', type: 'String' },
        { field: 'encounterId', type: 'String' },
        { field: 'icdCodes', type: 'String[]' },
        { field: 'notes', type: 'String' },
        { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
    {
      name: 'Invoice',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'patientId', type: 'String' },
        { field: 'appointmentId', type: 'String' },
        { field: 'totalCents', type: 'Int' },
        { field: 'paidCents', type: 'Int', note: '@default(0)' },
        { field: 'status', type: 'InvoiceStatus' },
        { field: 'dueAt', type: 'DateTime' },
      ],
    },
  ]
}

function fintechEntities(): StartupEntity[] {
  return [
    {
      name: 'Account',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'userId', type: 'String' },
        { field: 'accountNumber', type: 'String', note: '@unique' },
        { field: 'type', type: 'AccountType' },
        { field: 'balanceCents', type: 'Int', note: '@default(0)' },
        { field: 'currency', type: 'String', note: '@default("USD")' },
        { field: 'transactions', type: 'Transaction[]' },
      ],
    },
    {
      name: 'Transaction',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'accountId', type: 'String' },
        { field: 'amountCents', type: 'Int' },
        { field: 'direction', type: 'Direction' },
        { field: 'category', type: 'String?' },
        { field: 'description', type: 'String' },
        { field: 'merchantId', type: 'String?' },
        { field: 'processedAt', type: 'DateTime' },
      ],
    },
    {
      name: 'Card',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'userId', type: 'String' },
        { field: 'accountId', type: 'String' },
        { field: 'last4', type: 'String' },
        { field: 'network', type: 'CardNetwork' },
        { field: 'status', type: 'CardStatus', note: '@default(ACTIVE)' },
        { field: 'expiresAt', type: 'DateTime' },
      ],
    },
    {
      name: 'User',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'email', type: 'String', note: '@unique' },
        { field: 'kycStatus', type: 'KycStatus', note: '@default(PENDING)' },
        { field: 'accounts', type: 'Account[]' },
        { field: 'cards', type: 'Card[]' },
        { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
  ]
}

function marketplaceEntities(): StartupEntity[] {
  return [
    {
      name: 'Listing',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'sellerId', type: 'String' },
        { field: 'title', type: 'String' },
        { field: 'description', type: 'String' },
        { field: 'priceCents', type: 'Int' },
        { field: 'category', type: 'String' },
        { field: 'status', type: 'ListingStatus', note: '@default(DRAFT)' },
        { field: 'images', type: 'String[]' },
        { field: 'orders', type: 'Order[]' },
      ],
    },
    {
      name: 'Order',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'buyerId', type: 'String' },
        { field: 'listingId', type: 'String' },
        { field: 'totalCents', type: 'Int' },
        { field: 'platformFeeCents', type: 'Int' },
        { field: 'status', type: 'OrderStatus', note: '@default(PENDING)' },
        { field: 'stripePaymentId', type: 'String?', note: '@unique' },
      ],
    },
    {
      name: 'Seller',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'userId', type: 'String', note: '@unique' },
        { field: 'displayName', type: 'String' },
        { field: 'verified', type: 'Boolean', note: '@default(false)' },
        { field: 'rating', type: 'Float', note: '@default(0)' },
        { field: 'stripeAccountId', type: 'String?', note: '@unique' },
        { field: 'listings', type: 'Listing[]' },
      ],
    },
    {
      name: 'Review',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'orderId', type: 'String', note: '@unique' },
        { field: 'reviewerId', type: 'String' },
        { field: 'rating', type: 'Int' },
        { field: 'body', type: 'String?' },
        { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
  ]
}

function devtoolEntities(): StartupEntity[] {
  return [
    {
      name: 'Service',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'teamId', type: 'String' },
        { field: 'name', type: 'String' },
        { field: 'slug', type: 'String', note: '@unique' },
        { field: 'language', type: 'String?' },
        { field: 'status', type: 'ServiceStatus', note: '@default(HEALTHY)' },
        { field: 'incidents', type: 'Incident[]' },
      ],
    },
    {
      name: 'Incident',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'serviceId', type: 'String' },
        { field: 'severity', type: 'Severity' },
        { field: 'title', type: 'String' },
        { field: 'status', type: 'IncidentStatus', note: '@default(OPEN)' },
        { field: 'detectedAt', type: 'DateTime' },
        { field: 'resolvedAt', type: 'DateTime?' },
      ],
    },
    {
      name: 'Deploy',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'serviceId', type: 'String' },
        { field: 'sha', type: 'String' },
        { field: 'ref', type: 'String' },
        { field: 'author', type: 'String' },
        { field: 'status', type: 'DeployStatus' },
        { field: 'deployedAt', type: 'DateTime' },
      ],
    },
    {
      name: 'AlertRule',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'serviceId', type: 'String' },
        { field: 'metric', type: 'String' },
        { field: 'threshold', type: 'Float' },
        { field: 'operator', type: 'String' },
        { field: 'enabled', type: 'Boolean', note: '@default(true)' },
        { field: 'channels', type: 'String[]' },
      ],
    },
  ]
}

function aiToolEntities(): StartupEntity[] {
  return [
    {
      name: 'Pipeline',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'workspaceId', type: 'String' },
        { field: 'name', type: 'String' },
        { field: 'model', type: 'String', note: '@default("gpt-4o")' },
        { field: 'systemPrompt', type: 'String?' },
        { field: 'temperature', type: 'Float', note: '@default(0.7)' },
        { field: 'runs', type: 'PipelineRun[]' },
      ],
    },
    {
      name: 'PipelineRun',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'pipelineId', type: 'String' },
        { field: 'inputTokens', type: 'Int' },
        { field: 'outputTokens', type: 'Int' },
        { field: 'latencyMs', type: 'Int' },
        { field: 'status', type: 'RunStatus' },
        { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
    {
      name: 'ApiKey',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'workspaceId', type: 'String' },
        { field: 'name', type: 'String' },
        { field: 'prefix', type: 'String', note: '@unique' },
        { field: 'hashedKey', type: 'String', note: '@unique' },
        { field: 'lastUsedAt', type: 'DateTime?' },
        { field: 'expiresAt', type: 'DateTime?' },
      ],
    },
    {
      name: 'UsageRecord',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'workspaceId', type: 'String' },
        { field: 'date', type: 'DateTime' },
        { field: 'requests', type: 'Int', note: '@default(0)' },
        { field: 'inputTokens', type: 'Int', note: '@default(0)' },
        { field: 'outputTokens', type: 'Int', note: '@default(0)' },
        { field: 'costCents', type: 'Int', note: '@default(0)' },
      ],
    },
  ]
}

function socialEntities(): StartupEntity[] {
  return [
    {
      name: 'User',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'username', type: 'String', note: '@unique' },
        { field: 'displayName', type: 'String' },
        { field: 'bio', type: 'String?' },
        { field: 'avatarUrl', type: 'String?' },
        { field: 'followersCount', type: 'Int', note: '@default(0)' },
        { field: 'posts', type: 'Post[]' },
      ],
    },
    {
      name: 'Post',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'authorId', type: 'String' },
        { field: 'body', type: 'String' },
        { field: 'mediaUrls', type: 'String[]' },
        { field: 'groupId', type: 'String?' },
        { field: 'likesCount', type: 'Int', note: '@default(0)' },
        { field: 'publishedAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
    {
      name: 'Group',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'name', type: 'String' },
        { field: 'slug', type: 'String', note: '@unique' },
        { field: 'description', type: 'String?' },
        { field: 'visibility', type: 'Visibility', note: '@default(PUBLIC)' },
        { field: 'memberCount', type: 'Int', note: '@default(0)' },
        { field: 'posts', type: 'Post[]' },
      ],
    },
    {
      name: 'Message',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'senderId', type: 'String' },
        { field: 'recipientId', type: 'String' },
        { field: 'body', type: 'String' },
        { field: 'readAt', type: 'DateTime?' },
        { field: 'sentAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
  ]
}

function ecommerceEntities(): StartupEntity[] {
  return [
    {
      name: 'Product',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'storeId', type: 'String' },
        { field: 'title', type: 'String' },
        { field: 'description', type: 'String' },
        { field: 'priceCents', type: 'Int' },
        { field: 'stock', type: 'Int', note: '@default(0)' },
        { field: 'sku', type: 'String', note: '@unique' },
        { field: 'images', type: 'String[]' },
      ],
    },
    {
      name: 'Order',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'customerId', type: 'String' },
        { field: 'storeId', type: 'String' },
        { field: 'subtotalCents', type: 'Int' },
        { field: 'shippingCents', type: 'Int' },
        { field: 'status', type: 'OrderStatus', note: '@default(PENDING)' },
        { field: 'stripePaymentId', type: 'String?', note: '@unique' },
        { field: 'items', type: 'OrderItem[]' },
      ],
    },
    {
      name: 'Customer',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'email', type: 'String', note: '@unique' },
        { field: 'name', type: 'String?' },
        { field: 'stripeCustomerId', type: 'String?' },
        { field: 'orders', type: 'Order[]' },
        { field: 'createdAt', type: 'DateTime', note: '@default(now)' },
      ],
    },
    {
      name: 'Shipment',
      fields: [
        { field: 'id', type: 'String', note: '@id @cuid' },
        { field: 'orderId', type: 'String', note: '@unique' },
        { field: 'carrier', type: 'String' },
        { field: 'trackingNumber', type: 'String', note: '@unique' },
        { field: 'status', type: 'ShipmentStatus' },
        { field: 'estimatedDelivery', type: 'DateTime?' },
      ],
    },
  ]
}

// ── API endpoints per category ─────────────────────────────────────────────────

function saasApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/projects', summary: 'List all projects for the authenticated organization', responseExample: `{ "data": [{ "id": "proj_01", "name": "Q2 Launch", "status": "active" }] }` },
    { method: 'POST', path: '/api/projects', summary: 'Create a new project', requestExample: `{ "name": "Feature Sprint", "description": "..." }`, responseExample: `{ "data": { "id": "proj_02", "name": "Feature Sprint" } }` },
    { method: 'GET', path: '/api/projects/:id/tasks', summary: 'List tasks for a project', responseExample: `{ "data": [{ "id": "task_01", "title": "Design mockup", "status": "todo" }] }` },
    { method: 'POST', path: '/api/tasks', summary: 'Create a task', requestExample: `{ "title": "Build auth flow", "projectId": "proj_01", "priority": "high" }`, responseExample: `{ "data": { "id": "task_02", "status": "todo" } }` },
    { method: 'PATCH', path: '/api/tasks/:id', summary: 'Update task status or assignment', requestExample: `{ "status": "in_progress", "assigneeId": "usr_01" }` },
    { method: 'GET', path: '/api/analytics/summary', summary: 'Organization-level usage metrics', responseExample: `{ "mrr": 12400, "activeUsers": 847, "churnRate": 0.021 }` },
  ]
}

function healthcareApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/patients', summary: 'List patients for the authenticated provider', responseExample: `{ "data": [{ "id": "pat_01", "mrn": "MRN-0042", "firstName": "Sarah" }] }` },
    { method: 'POST', path: '/api/patients', summary: 'Register a new patient', requestExample: `{ "firstName": "John", "lastName": "Doe", "dateOfBirth": "1985-03-14", "email": "john@email.com" }` },
    { method: 'GET', path: '/api/appointments', summary: 'Fetch upcoming appointments', responseExample: `{ "data": [{ "id": "appt_01", "patientId": "pat_01", "scheduledAt": "2026-06-01T09:00:00Z" }] }` },
    { method: 'POST', path: '/api/appointments', summary: 'Book a new appointment', requestExample: `{ "patientId": "pat_01", "providerId": "prov_01", "scheduledAt": "2026-06-05T10:00:00Z", "type": "FOLLOW_UP" }` },
    { method: 'GET', path: '/api/providers/:id/availability', summary: 'Get available time slots for a provider', responseExample: `{ "slots": ["2026-06-05T09:00:00Z", "2026-06-05T10:00:00Z"] }` },
    { method: 'POST', path: '/api/invoices', summary: 'Create an invoice for an appointment', requestExample: `{ "appointmentId": "appt_01", "totalCents": 15000 }` },
  ]
}

function fintechApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/accounts', summary: 'List all accounts for the authenticated user', responseExample: `{ "data": [{ "id": "acct_01", "type": "CHECKING", "balanceCents": 248500 }] }` },
    { method: 'GET', path: '/api/accounts/:id/transactions', summary: 'Paginated transaction history', responseExample: `{ "data": [{ "id": "txn_01", "amountCents": -4200, "description": "Coffee" }], "cursor": "tok_xyz" }` },
    { method: 'POST', path: '/api/transfers', summary: 'Initiate a transfer between accounts', requestExample: `{ "fromAccountId": "acct_01", "toAccountId": "acct_02", "amountCents": 10000, "note": "Rent" }` },
    { method: 'GET', path: '/api/cards', summary: 'List virtual and physical cards', responseExample: `{ "data": [{ "id": "card_01", "last4": "4242", "status": "ACTIVE" }] }` },
    { method: 'POST', path: '/api/cards/:id/freeze', summary: 'Freeze or unfreeze a card', requestExample: `{ "frozen": true }` },
    { method: 'GET', path: '/api/analytics/spending', summary: 'AI-categorized spending breakdown', responseExample: `{ "categories": [{ "name": "Food", "amountCents": 32000 }], "period": "2026-05" }` },
  ]
}

function marketplaceApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/listings', summary: 'Browse listings with filters and search', responseExample: `{ "data": [{ "id": "lst_01", "title": "Vintage Chair", "priceCents": 12000 }], "total": 2341 }` },
    { method: 'POST', path: '/api/listings', summary: 'Create a new listing', requestExample: `{ "title": "Vintage Chair", "priceCents": 12000, "category": "furniture", "images": ["url1"] }` },
    { method: 'GET', path: '/api/listings/:id', summary: 'Get listing details and seller info' },
    { method: 'POST', path: '/api/orders', summary: 'Place an order for a listing', requestExample: `{ "listingId": "lst_01", "paymentMethodId": "pm_stripe_xyz" }`, responseExample: `{ "data": { "id": "ord_01", "status": "PENDING" } }` },
    { method: 'GET', path: '/api/sellers/:id', summary: 'Get seller profile and reviews', responseExample: `{ "data": { "id": "slr_01", "displayName": "Vintage Co.", "rating": 4.8 } }` },
    { method: 'POST', path: '/api/reviews', summary: 'Submit a review for a completed order', requestExample: `{ "orderId": "ord_01", "rating": 5, "body": "Great seller, fast shipping!" }` },
  ]
}

function devtoolApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/services', summary: 'List all monitored services for the team', responseExample: `{ "data": [{ "id": "svc_01", "name": "api-gateway", "status": "HEALTHY" }] }` },
    { method: 'POST', path: '/api/services', summary: 'Register a new service for monitoring', requestExample: `{ "name": "user-service", "language": "Node.js", "repo": "org/user-service" }` },
    { method: 'GET', path: '/api/incidents', summary: 'List open and recent incidents', responseExample: `{ "data": [{ "id": "inc_01", "severity": "P1", "title": "API latency spike", "status": "OPEN" }] }` },
    { method: 'POST', path: '/api/incidents/:id/resolve', summary: 'Mark an incident as resolved', requestExample: `{ "resolution": "Rolled back deploy #142" }` },
    { method: 'GET', path: '/api/deploys', summary: 'Get deploy history across services', responseExample: `{ "data": [{ "id": "dep_01", "sha": "a1b2c3d", "status": "SUCCESS", "deployedAt": "2026-05-31T12:00:00Z" }] }` },
    { method: 'POST', path: '/api/alerts/rules', summary: 'Create an alert rule for a service metric', requestExample: `{ "serviceId": "svc_01", "metric": "error_rate", "threshold": 0.05, "channels": ["slack"] }` },
  ]
}

function aiToolApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/pipelines', summary: 'List all pipelines in the workspace', responseExample: `{ "data": [{ "id": "pip_01", "name": "Email Classifier", "model": "gpt-4o" }] }` },
    { method: 'POST', path: '/api/pipelines', summary: 'Create a new pipeline', requestExample: `{ "name": "Invoice Parser", "model": "gpt-4o", "systemPrompt": "Extract invoice fields..." }` },
    { method: 'POST', path: '/api/pipelines/:id/run', summary: 'Execute a pipeline with input data', requestExample: `{ "input": "Invoice total: $1,234.00 due June 15" }`, responseExample: `{ "output": { "total": 1234, "dueDate": "2026-06-15" }, "latencyMs": 420 }` },
    { method: 'GET', path: '/api/pipelines/:id/runs', summary: 'Get run history and performance stats', responseExample: `{ "data": [{ "id": "run_01", "status": "SUCCESS", "latencyMs": 380 }] }` },
    { method: 'GET', path: '/api/usage', summary: 'Current month token usage and cost', responseExample: `{ "requests": 48200, "inputTokens": 9840000, "costCents": 14760 }` },
    { method: 'POST', path: '/api/keys', summary: 'Issue a new API key', requestExample: `{ "name": "Production Key", "expiresAt": null }`, responseExample: `{ "key": "xyn_live_...", "prefix": "xyn_live_" }` },
  ]
}

function socialApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/feed', summary: 'Get personalized feed for the authenticated user', responseExample: `{ "posts": [{ "id": "pst_01", "body": "Hello world!", "likesCount": 42 }] }` },
    { method: 'POST', path: '/api/posts', summary: 'Publish a new post', requestExample: `{ "body": "Excited to share this!", "groupId": "grp_01" }`, responseExample: `{ "data": { "id": "pst_02", "publishedAt": "2026-05-31T..." } }` },
    { method: 'GET', path: '/api/groups', summary: 'Browse and search groups', responseExample: `{ "data": [{ "id": "grp_01", "name": "Founders", "memberCount": 2841 }] }` },
    { method: 'POST', path: '/api/groups/:id/join', summary: 'Join a group', responseExample: `{ "success": true }` },
    { method: 'GET', path: '/api/messages', summary: 'List direct message threads', responseExample: `{ "threads": [{ "userId": "usr_02", "lastMessage": "Hey!", "unread": 3 }] }` },
    { method: 'POST', path: '/api/messages', summary: 'Send a direct message', requestExample: `{ "recipientId": "usr_02", "body": "Hey, saw your post!" }` },
  ]
}

function ecommerceApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET', path: '/api/products', summary: 'List products in the store with filters', responseExample: `{ "data": [{ "id": "prd_01", "title": "Classic Tee", "priceCents": 2999, "stock": 42 }] }` },
    { method: 'POST', path: '/api/products', summary: 'Add a new product to the catalog', requestExample: `{ "title": "Classic Tee", "priceCents": 2999, "sku": "TSHIRT-BLK-M", "stock": 100 }` },
    { method: 'POST', path: '/api/orders', summary: 'Create a new order', requestExample: `{ "items": [{ "productId": "prd_01", "quantity": 2 }], "shippingAddress": { ... } }`, responseExample: `{ "data": { "id": "ord_01", "status": "PENDING", "totalCents": 5998 } }` },
    { method: 'GET', path: '/api/orders', summary: 'List orders for the store or customer', responseExample: `{ "data": [{ "id": "ord_01", "status": "SHIPPED", "totalCents": 5998 }] }` },
    { method: 'GET', path: '/api/orders/:id/shipment', summary: 'Get shipping and tracking info', responseExample: `{ "carrier": "FedEx", "trackingNumber": "7489...", "status": "IN_TRANSIT" }` },
    { method: 'GET', path: '/api/analytics/revenue', summary: 'Revenue analytics for the store', responseExample: `{ "mrr": 34800, "orders": 1241, "conversionRate": 0.034 }` },
  ]
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
