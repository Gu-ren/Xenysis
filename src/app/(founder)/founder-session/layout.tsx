export default function FounderSessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex h-screen overflow-hidden bg-background">{children}</div>
}
