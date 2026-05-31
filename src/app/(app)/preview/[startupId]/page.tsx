import { PreviewStartupScreen } from '@/modules/preview/screens/preview-startup-screen'

interface PageProps {
  params: Promise<{ startupId: string }>
  searchParams: Promise<{ screen?: string }>
}

export default async function PreviewPage({ params, searchParams }: PageProps) {
  const { startupId } = await params
  const { screen } = await searchParams
  return <PreviewStartupScreen startupId={startupId} initialScreenId={screen} />
}
