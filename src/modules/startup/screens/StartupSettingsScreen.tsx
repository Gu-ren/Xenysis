export default async function StartupSettingsScreen({
  params,
}: {
  params: Promise<{ startupId: string }>
}) {
  await params

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-foreground">Startup Settings</h1>
      <p className="text-sm text-muted mt-1">Configuration and preferences for this startup.</p>
    </div>
  )
}
