import type { FounderUnderstanding, UnderstandingCategory } from '../types/understanding'

const CATEGORY_KEYS: UnderstandingCategory[] = [
  'problem',
  'customer',
  'solution',
  'market',
  'pricing',
  'competition',
  'risks',
  'founder_fit',
  'supply_side',
]

/** Stable fingerprint that changes when the understanding engine writes a new turn. */
export function understandingFingerprint(u: FounderUnderstanding): string {
  const cats = CATEGORY_KEYS.map((key) => {
    const c = u.categories[key]
    if (!c) return `${key}:missing`
    return `${key}:${c.confidence}:${c.evidenceCount}:${c.status}:${c.evidenceStrength}`
  }).join('|')

  return [
    u.overallConfidence,
    u.isComplete ? 1 : 0,
    u.questioningMode,
    u.focusHistory.length,
    u.pivotCount,
    cats,
  ].join('::')
}
