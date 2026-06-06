import type { StartupEntity } from '../types'

export function saasEntities(): StartupEntity[] {
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

export function healthcareEntities(): StartupEntity[] {
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

export function fintechEntities(): StartupEntity[] {
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

export function marketplaceEntities(): StartupEntity[] {
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

export function devtoolEntities(): StartupEntity[] {
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

export function aiToolEntities(): StartupEntity[] {
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

export function socialEntities(): StartupEntity[] {
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

export function ecommerceEntities(): StartupEntity[] {
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
