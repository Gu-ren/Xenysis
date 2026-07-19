'use client'

import { Plus, Trash2 } from 'lucide-react'
import { EditableField } from '../ui/editable-field'
import type { CustomSection } from '../types/blueprint-api'

interface CustomSectionsProps {
  sections: CustomSection[]
  editable?: boolean
  onChange?: (sections: CustomSection[]) => void
}

export function CustomSections({ sections, editable = false, onChange }: CustomSectionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500">Freeform notes that travel with your blueprint.</p>
        {editable && (
          <button
            type="button"
            onClick={() =>
              onChange?.([
                ...sections,
                { id: crypto.randomUUID(), title: 'New section', body: '' },
              ])
            }
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
          >
            <Plus className="w-3.5 h-3.5" />
            Add section
          </button>
        )}
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-zinc-500">No custom sections yet.</p>
      ) : (
        sections.map((section, index) => (
          <div key={section.id} className="space-y-3 pb-6 border-b border-white/[0.06] last:border-0">
            <div className="flex items-start justify-between gap-3">
              <EditableField
                label="Title"
                value={section.title}
                editable={editable}
                onChange={(title) => {
                  const next = [...sections]
                  next[index] = { ...section, title }
                  onChange?.(next)
                }}
                className="flex-1"
              />
              {editable && (
                <button
                  type="button"
                  onClick={() => onChange?.(sections.filter((s) => s.id !== section.id))}
                  className="mt-6 p-2 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <EditableField
              label="Body"
              value={section.body}
              editable={editable}
              multiline
              onChange={(body) => {
                const next = [...sections]
                next[index] = { ...section, body }
                onChange?.(next)
              }}
            />
          </div>
        ))
      )}
    </div>
  )
}
