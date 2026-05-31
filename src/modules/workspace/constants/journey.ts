// Startup lifecycle stages used by StartupProgressPanel.
// Each stage maps to a set of workspace asset IDs; completion is derived from their statuses.
// Expand this file when Milestones and Tasks are added to the data model.

export const STAGES = [
  {
    id: 'founder-session',
    label: 'Founder Session',
    assetIds: [] as string[],
  },
  {
    id: 'build',
    label: 'Build',
    assetIds: [
      'landing', 'signup', 'login', 'dashboard', 'pricing', 'settings',
      'users-table', 'subscriptions-table', 'sessions-table',
      'auth-service', 'billing-service',
    ],
  },
  {
    id: 'launch',
    label: 'Launch',
    assetIds: ['stripe-integration', 'resend-integration', 'onboarding-workflow', 'payment-workflow'],
  },
] as const
