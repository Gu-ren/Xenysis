import { cn } from '@/lib/utils'
import { MonoLabel } from '@/components/ui/mono-label'

interface SectionHeaderProps {
  children: React.ReactNode
  className?: string
}

export function SectionHeader({ children, className }: SectionHeaderProps) {
  return (
    <MonoLabel
      as="span"
      className={cn('block text-[10px] uppercase tracking-[0.1em] text-muted', className)}
    >
      {children}
    </MonoLabel>
  )
}
