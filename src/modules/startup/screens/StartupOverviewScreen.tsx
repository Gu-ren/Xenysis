export default async function StartupOverviewScreen({
  params,
}: {
  params: Promise<{ startupId: string }>
}) {
  const { startupId } = await params

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-foreground">Startup Overview</h1>
      <p className="text-sm text-muted mt-1">Project overview for startup {startupId}.</p>
    </div>
  )
}
