import { MarketingNav } from "@/components/layout/marketing-nav"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      {children}
    </div>
  )
}
