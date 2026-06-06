import type { StartupApiEndpoint } from '../types'

export function saasApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',   path: '/api/projects',             summary: 'List all projects for the authenticated organization',    responseExample: `{ "data": [{ "id": "proj_01", "name": "Q2 Launch", "status": "active" }] }` },
    { method: 'POST',  path: '/api/projects',             summary: 'Create a new project',                                    requestExample: `{ "name": "Feature Sprint", "description": "..." }`,                          responseExample: `{ "data": { "id": "proj_02", "name": "Feature Sprint" } }` },
    { method: 'GET',   path: '/api/projects/:id/tasks',   summary: 'List tasks for a project',                               responseExample: `{ "data": [{ "id": "task_01", "title": "Design mockup", "status": "todo" }] }` },
    { method: 'POST',  path: '/api/tasks',                summary: 'Create a task',                                          requestExample: `{ "title": "Build auth flow", "projectId": "proj_01", "priority": "high" }`,   responseExample: `{ "data": { "id": "task_02", "status": "todo" } }` },
    { method: 'PATCH', path: '/api/tasks/:id',            summary: 'Update task status or assignment',                       requestExample: `{ "status": "in_progress", "assigneeId": "usr_01" }` },
    { method: 'GET',   path: '/api/analytics/summary',    summary: 'Organization-level usage metrics',                       responseExample: `{ "mrr": 12400, "activeUsers": 847, "churnRate": 0.021 }` },
  ]
}

export function healthcareApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',  path: '/api/patients',                    summary: 'List patients for the authenticated provider',  responseExample: `{ "data": [{ "id": "pat_01", "mrn": "MRN-0042", "firstName": "Sarah" }] }` },
    { method: 'POST', path: '/api/patients',                    summary: 'Register a new patient',                       requestExample: `{ "firstName": "John", "lastName": "Doe", "dateOfBirth": "1985-03-14", "email": "john@email.com" }` },
    { method: 'GET',  path: '/api/appointments',               summary: 'Fetch upcoming appointments',                  responseExample: `{ "data": [{ "id": "appt_01", "patientId": "pat_01", "scheduledAt": "2026-06-01T09:00:00Z" }] }` },
    { method: 'POST', path: '/api/appointments',               summary: 'Book a new appointment',                       requestExample: `{ "patientId": "pat_01", "providerId": "prov_01", "scheduledAt": "2026-06-05T10:00:00Z", "type": "FOLLOW_UP" }` },
    { method: 'GET',  path: '/api/providers/:id/availability', summary: 'Get available time slots for a provider',      responseExample: `{ "slots": ["2026-06-05T09:00:00Z", "2026-06-05T10:00:00Z"] }` },
    { method: 'POST', path: '/api/invoices',                   summary: 'Create an invoice for an appointment',         requestExample: `{ "appointmentId": "appt_01", "totalCents": 15000 }` },
  ]
}

export function fintechApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',  path: '/api/accounts',                  summary: 'List all accounts for the authenticated user', responseExample: `{ "data": [{ "id": "acct_01", "type": "CHECKING", "balanceCents": 248500 }] }` },
    { method: 'GET',  path: '/api/accounts/:id/transactions', summary: 'Paginated transaction history',               responseExample: `{ "data": [{ "id": "txn_01", "amountCents": -4200, "description": "Coffee" }], "cursor": "tok_xyz" }` },
    { method: 'POST', path: '/api/transfers',                 summary: 'Initiate a transfer between accounts',        requestExample: `{ "fromAccountId": "acct_01", "toAccountId": "acct_02", "amountCents": 10000, "note": "Rent" }` },
    { method: 'GET',  path: '/api/cards',                     summary: 'List virtual and physical cards',             responseExample: `{ "data": [{ "id": "card_01", "last4": "4242", "status": "ACTIVE" }] }` },
    { method: 'POST', path: '/api/cards/:id/freeze',          summary: 'Freeze or unfreeze a card',                  requestExample: `{ "frozen": true }` },
    { method: 'GET',  path: '/api/analytics/spending',        summary: 'AI-categorized spending breakdown',           responseExample: `{ "categories": [{ "name": "Food", "amountCents": 32000 }], "period": "2026-05" }` },
  ]
}

export function marketplaceApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',  path: '/api/listings',       summary: 'Browse listings with filters and search', responseExample: `{ "data": [{ "id": "lst_01", "title": "Vintage Chair", "priceCents": 12000 }], "total": 2341 }` },
    { method: 'POST', path: '/api/listings',       summary: 'Create a new listing',                   requestExample: `{ "title": "Vintage Chair", "priceCents": 12000, "category": "furniture", "images": ["url1"] }` },
    { method: 'GET',  path: '/api/listings/:id',   summary: 'Get listing details and seller info' },
    { method: 'POST', path: '/api/orders',         summary: 'Place an order for a listing',           requestExample: `{ "listingId": "lst_01", "paymentMethodId": "pm_stripe_xyz" }`,                                      responseExample: `{ "data": { "id": "ord_01", "status": "PENDING" } }` },
    { method: 'GET',  path: '/api/sellers/:id',    summary: 'Get seller profile and reviews',         responseExample: `{ "data": { "id": "slr_01", "displayName": "Vintage Co.", "rating": 4.8 } }` },
    { method: 'POST', path: '/api/reviews',        summary: 'Submit a review for a completed order',  requestExample: `{ "orderId": "ord_01", "rating": 5, "body": "Great seller, fast shipping!" }` },
  ]
}

export function devtoolApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',  path: '/api/services',            summary: 'List all monitored services for the team', responseExample: `{ "data": [{ "id": "svc_01", "name": "api-gateway", "status": "HEALTHY" }] }` },
    { method: 'POST', path: '/api/services',            summary: 'Register a new service for monitoring',    requestExample: `{ "name": "user-service", "language": "Node.js", "repo": "org/user-service" }` },
    { method: 'GET',  path: '/api/incidents',           summary: 'List open and recent incidents',           responseExample: `{ "data": [{ "id": "inc_01", "severity": "P1", "title": "API latency spike", "status": "OPEN" }] }` },
    { method: 'POST', path: '/api/incidents/:id/resolve', summary: 'Mark an incident as resolved',          requestExample: `{ "resolution": "Rolled back deploy #142" }` },
    { method: 'GET',  path: '/api/deploys',             summary: 'Get deploy history across services',       responseExample: `{ "data": [{ "id": "dep_01", "sha": "a1b2c3d", "status": "SUCCESS", "deployedAt": "2026-05-31T12:00:00Z" }] }` },
    { method: 'POST', path: '/api/alerts/rules',        summary: 'Create an alert rule for a service metric', requestExample: `{ "serviceId": "svc_01", "metric": "error_rate", "threshold": 0.05, "channels": ["slack"] }` },
  ]
}

export function aiToolApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',  path: '/api/pipelines',          summary: 'List all pipelines in the workspace',      responseExample: `{ "data": [{ "id": "pip_01", "name": "Email Classifier", "model": "gpt-4o" }] }` },
    { method: 'POST', path: '/api/pipelines',          summary: 'Create a new pipeline',                   requestExample: `{ "name": "Invoice Parser", "model": "gpt-4o", "systemPrompt": "Extract invoice fields..." }` },
    { method: 'POST', path: '/api/pipelines/:id/run', summary: 'Execute a pipeline with input data',       requestExample: `{ "input": "Invoice total: $1,234.00 due June 15" }`,                                         responseExample: `{ "output": { "total": 1234, "dueDate": "2026-06-15" }, "latencyMs": 420 }` },
    { method: 'GET',  path: '/api/pipelines/:id/runs', summary: 'Get run history and performance stats',   responseExample: `{ "data": [{ "id": "run_01", "status": "SUCCESS", "latencyMs": 380 }] }` },
    { method: 'GET',  path: '/api/usage',              summary: 'Current month token usage and cost',       responseExample: `{ "requests": 48200, "inputTokens": 9840000, "costCents": 14760 }` },
    { method: 'POST', path: '/api/keys',               summary: 'Issue a new API key',                     requestExample: `{ "name": "Production Key", "expiresAt": null }`,                                              responseExample: `{ "key": "xyn_live_...", "prefix": "xyn_live_" }` },
  ]
}

export function socialApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',  path: '/api/feed',            summary: 'Get personalized feed for the authenticated user', responseExample: `{ "posts": [{ "id": "pst_01", "body": "Hello world!", "likesCount": 42 }] }` },
    { method: 'POST', path: '/api/posts',           summary: 'Publish a new post',                             requestExample: `{ "body": "Excited to share this!", "groupId": "grp_01" }`,                            responseExample: `{ "data": { "id": "pst_02", "publishedAt": "2026-05-31T..." } }` },
    { method: 'GET',  path: '/api/groups',          summary: 'Browse and search groups',                       responseExample: `{ "data": [{ "id": "grp_01", "name": "Founders", "memberCount": 2841 }] }` },
    { method: 'POST', path: '/api/groups/:id/join', summary: 'Join a group',                                   responseExample: `{ "success": true }` },
    { method: 'GET',  path: '/api/messages',        summary: 'List direct message threads',                    responseExample: `{ "threads": [{ "userId": "usr_02", "lastMessage": "Hey!", "unread": 3 }] }` },
    { method: 'POST', path: '/api/messages',        summary: 'Send a direct message',                          requestExample: `{ "recipientId": "usr_02", "body": "Hey, saw your post!" }` },
  ]
}

export function ecommerceApis(_name: string): StartupApiEndpoint[] {
  return [
    { method: 'GET',  path: '/api/products',              summary: 'List products in the store with filters', responseExample: `{ "data": [{ "id": "prd_01", "title": "Classic Tee", "priceCents": 2999, "stock": 42 }] }` },
    { method: 'POST', path: '/api/products',              summary: 'Add a new product to the catalog',        requestExample: `{ "title": "Classic Tee", "priceCents": 2999, "sku": "TSHIRT-BLK-M", "stock": 100 }` },
    { method: 'POST', path: '/api/orders',                summary: 'Create a new order',                      requestExample: `{ "items": [{ "productId": "prd_01", "quantity": 2 }], "shippingAddress": { ... } }`,  responseExample: `{ "data": { "id": "ord_01", "status": "PENDING", "totalCents": 5998 } }` },
    { method: 'GET',  path: '/api/orders',                summary: 'List orders for the store or customer',   responseExample: `{ "data": [{ "id": "ord_01", "status": "SHIPPED", "totalCents": 5998 }] }` },
    { method: 'GET',  path: '/api/orders/:id/shipment',   summary: 'Get shipping and tracking info',          responseExample: `{ "carrier": "FedEx", "trackingNumber": "7489...", "status": "IN_TRANSIT" }` },
    { method: 'GET',  path: '/api/analytics/revenue',     summary: 'Revenue analytics for the store',         responseExample: `{ "mrr": 34800, "orders": 1241, "conversionRate": 0.034 }` },
  ]
}
