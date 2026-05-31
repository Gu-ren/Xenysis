export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ startupId: string }>
}) {
  await params

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-foreground">Workspace</h1>
      <p className="text-sm text-muted mt-1">Your AI-powered development workspace.</p>
    </div>
  )
}
