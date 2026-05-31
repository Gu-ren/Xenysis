export default async function LogsPage({
  params,
}: {
  params: Promise<{ startupId: string }>
}) {
  await params

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-foreground">Logs</h1>
      <p className="text-sm text-muted mt-1">Runtime logs, errors, and audit trail.</p>
    </div>
  )
}
