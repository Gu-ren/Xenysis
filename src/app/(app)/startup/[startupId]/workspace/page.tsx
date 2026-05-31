import { WorkspaceScreen } from '@/modules/workspace/screens/workspace-screen'

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ startupId: string }>
  searchParams: Promise<{ asset?: string | string[] }>
}) {
  const { startupId } = await params
  const sp = await searchParams
  const initialAssetId = typeof sp.asset === 'string' ? sp.asset : undefined
  return <WorkspaceScreen startupId={startupId} initialAssetId={initialAssetId} />
}
