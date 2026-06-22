import { apiPost, hasBackend } from '@/lib/api'

export interface WaitlistEntry {
  id:           string
  userId:       string
  startupId:    string
  startupName:  string
  founderStage: string
  blueprintId:  string | null
  email:        string
  source:       string
  status:       string
  joinedAt:     string
  notifiedAt:   string | null
  activatedAt:  string | null
  createdAt:    string
}

interface JoinWaitlistBody {
  startupId:    string
  blueprintId?: string
}

interface JoinWaitlistResponse {
  data: WaitlistEntry
}

export async function joinWorkspaceWaitlist(params: JoinWaitlistBody): Promise<WaitlistEntry> {
  if (!hasBackend) {
    await new Promise((r) => setTimeout(r, 600))
    return {
      id:           'mock-waitlist-id',
      userId:       'mock-user',
      startupId:    params.startupId,
      startupName:  'Your Startup',
      founderStage: 'building',
      blueprintId:  params.blueprintId ?? null,
      email:        'you@startup.com',
      source:       'workspace_generation',
      status:       'waiting',
      joinedAt:     new Date().toISOString(),
      notifiedAt:   null,
      activatedAt:  null,
      createdAt:    new Date().toISOString(),
    }
  }

  const { data } = await apiPost<JoinWaitlistBody, JoinWaitlistResponse>(
    '/api/v1/waitlist/workspace',
    params,
  )
  return data
}
