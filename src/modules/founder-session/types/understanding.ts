export type CategoryStatus = 'missing' | 'partial' | 'complete'

export type ValidationStatus = 'unknown' | 'validated' | 'explicitly_unvalidated'

export type AssessmentTier = 'unknown' | 'gap' | 'assumption_based' | 'validated'

export type QuestioningMode = 'discovery' | 'gap_identification'

export type UnderstandingCategory =
  | 'problem'
  | 'customer'
  | 'solution'
  | 'market'
  | 'pricing'
  | 'competition'
  | 'risks'
  | 'founder_fit'

export interface CategoryState {
  confidence: number
  status: CategoryStatus
  evidenceCount: number
  evidence: string[]
  evidenceStrength: number
  validationStatus: ValidationStatus
  weakAbsenceCount: number
  saturationCount: number
  lastFocusConfidence: number
  assessmentTier: AssessmentTier
}

export interface CategoryWarning {
  category: UnderstandingCategory
  confidence: number
  evidenceStrength: number
  message: string
}

export interface FounderUnderstanding {
  _schemaVersion: '1.1'
  categories: Record<UnderstandingCategory, CategoryState>
  overallConfidence: number
  isComplete: boolean
  weakestCategory: UnderstandingCategory | null
  warnings: CategoryWarning[]
  completionReason?: string
  focusHistory: string[]
  validationGaps: UnderstandingCategory[]
  questioningMode: QuestioningMode
}

const EMPTY_CATEGORY: CategoryState = {
  confidence:          0,
  status:              'missing',
  evidenceCount:       0,
  evidence:            [],
  evidenceStrength:    1,
  validationStatus:    'unknown',
  weakAbsenceCount:    0,
  saturationCount:     0,
  lastFocusConfidence: 0,
  assessmentTier:      'unknown',
}

export const EMPTY_UNDERSTANDING: FounderUnderstanding = {
  _schemaVersion: '1.1',
  categories: {
    problem:     { ...EMPTY_CATEGORY },
    customer:    { ...EMPTY_CATEGORY },
    solution:    { ...EMPTY_CATEGORY },
    market:      { ...EMPTY_CATEGORY },
    pricing:     { ...EMPTY_CATEGORY },
    competition: { ...EMPTY_CATEGORY },
    risks:       { ...EMPTY_CATEGORY },
    founder_fit: { ...EMPTY_CATEGORY },
  },
  overallConfidence: 0,
  isComplete:        false,
  weakestCategory:   null,
  warnings:          [],
  focusHistory:      [],
  validationGaps:    [],
  questioningMode:   'discovery',
}

export const CATEGORY_DISPLAY: Record<UnderstandingCategory, { label: string; required: boolean }> = {
  problem:     { label: 'Problem Identified',    required: true  },
  customer:    { label: 'Customer Identified',   required: true  },
  solution:    { label: 'Solution Understood',   required: true  },
  market:      { label: 'Market Understood',     required: false },
  pricing:     { label: 'Pricing Identified',    required: false },
  competition: { label: 'Competition Validated', required: false },
  risks:       { label: 'Risks Clarified',       required: false },
  founder_fit: { label: 'Founder Fit Assessed',  required: false },
}

export const ORDERED_CATEGORIES: UnderstandingCategory[] = [
  'problem', 'customer', 'solution',
  'market', 'pricing', 'competition', 'risks', 'founder_fit',
]

// Human-readable focus area names for the "Current Focus" card.
// Noun-phrase form, reads naturally as "Currently investigating: X".
export const FOCUS_LABEL: Record<UnderstandingCategory, string> = {
  problem:     'Problem Definition',
  customer:    'Customer Discovery',
  solution:    'Solution Clarity',
  market:      'Market Analysis',
  pricing:     'Pricing Strategy',
  competition: 'Competition Validation',
  risks:       'Risk Assessment',
  founder_fit: 'Founder Fit',
}
