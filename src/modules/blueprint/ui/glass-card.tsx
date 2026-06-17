import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function GlassCard({ children, className, id }: GlassCardProps) {
  return (
    <div
      id={id}
      className={cn(
        'bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 transition-colors duration-200 hover:border-white/[0.1]',
        className,
      )}
    >
      {children}
    </div>
  )
}
