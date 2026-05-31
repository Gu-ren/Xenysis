import { cn } from '@/lib/utils'
import { SectionHeader } from '../../components/section-header'
import type { StartupBlueprint } from '../../types'

interface BlueprintCardProps {
  blueprint: StartupBlueprint
}

function statusDotClass(status: string): string {
  if (status === 'active') return 'bg-primary'
  if (status === 'generating') return 'bg-primary/65'
  if (status === 'wired') return 'bg-muted/60'
  return 'bg-muted/30'
}

function statusLabel(status: string): string {
  if (status === 'active') return 'active'
  if (status === 'generating') return 'generating'
  if (status === 'wired') return 'wired'
  return 'pending'
}

export function BlueprintCard({ blueprint }: BlueprintCardProps) {
  return (
    <div className="w-full bg-card border border-border rounded-xl overflow-hidden">
      {/* Pattern header */}
      <div className="px-5 py-4 border-b border-border">
        <SectionHeader className="mb-1.5">Detected Pattern</SectionHeader>
        <p className="text-foreground text-[15px] font-semibold tracking-tight m-0">
          {blueprint.detectedPattern}
        </p>
      </div>

      {/* Systems */}
      <div className="px-5 py-4 border-b border-border">
        <SectionHeader className="mb-3">Confirmed Systems</SectionHeader>
        <div className="flex flex-col gap-2">
          {blueprint.systems.map((system, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono text-[11px]">+</span>
                <span className="text-foreground font-mono text-[12px]">{system.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusDotClass(system.status))}
                />
                <span
                  className={cn(
                    'font-mono text-[10px] italic',
                    system.status === 'active' ? 'text-primary' :
                    system.status === 'generating' ? 'text-primary/65' :
                    'text-muted/60',
                  )}
                >
                  {statusLabel(system.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="px-5 py-3.5 flex items-center gap-0 font-mono text-[11px]">
        <span className="text-muted">Architecture: </span>
        <span className="text-primary mr-4">{blueprint.architectureScore}%</span>
        <span className="text-muted/40 mr-4">·</span>
        <span className="text-muted">Confidence: </span>
        <span className="text-primary">{blueprint.workflowConfidence}</span>
      </div>
    </div>
  )
}
