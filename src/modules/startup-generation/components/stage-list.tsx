'use client'

import { StageRow } from './stage-row'
import type { ActiveStage } from '../types'

interface StageListProps {
  stages: ActiveStage[]
}

export function StageList({ stages }: StageListProps) {
  return (
    <div className="flex flex-col gap-4">
      {stages.map((stage) => (
        <StageRow key={stage.id} stage={stage} />
      ))}
    </div>
  )
}
