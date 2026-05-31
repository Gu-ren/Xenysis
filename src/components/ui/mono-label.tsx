import type { CSSProperties, ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MonoLabelProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'span' | 'p' | 'div' | 'label'
}

export function MonoLabel({ children, className, style, as: Tag = 'span' }: MonoLabelProps) {
  const Component = Tag as ElementType
  return (
    <Component
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.08em] font-medium text-muted",
        className
      )}
      style={style}
    >
      {children}
    </Component>
  )
}
