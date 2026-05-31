import type { GenerationStage } from '../types'

// Total duration ~8.3s. Asset counts must sum to match the workspace graph (16 assets).
export const GENERATION_STAGES: GenerationStage[] = [
  {
    id: 'business',
    label: 'Understanding your business',
    sublabel: 'Reading your founder session',
    durationMs: 600,
    assetCount: 0,
  },
  {
    id: 'design',
    label: 'Designing your startup',
    sublabel: 'Mapping architecture patterns',
    durationMs: 900,
    assetCount: 0,
  },
  {
    id: 'journeys',
    label: 'Building customer journeys',
    sublabel: 'Scaffolding pages and routes',
    durationMs: 1800,
    assetCount: 6,
  },
  {
    id: 'architecture',
    label: 'Creating system architecture',
    sublabel: 'Mapping data entities and services',
    durationMs: 1600,
    assetCount: 5,
  },
  {
    id: 'services',
    label: 'Connecting critical services',
    sublabel: 'Wiring workflows and integrations',
    durationMs: 1400,
    assetCount: 5,
  },
  {
    id: 'launch',
    label: 'Preparing for launch',
    sublabel: 'Configuring deployment strategy',
    durationMs: 1200,
    assetCount: 0,
  },
  {
    id: 'workspace',
    label: 'Assembling workspace',
    sublabel: 'Finalising your startup blueprint',
    durationMs: 800,
    assetCount: 0,
  },
]
