'use client'

import { useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { EditableField } from '../ui/editable-field'
import type { CustomBlock, CustomBlockField, CustomBlockFieldType } from '../types/blueprint-api'

const DOUBLE_TAP_MS = 300

const FIELD_TYPES: CustomBlockFieldType[] = [
  'string',
  'number',
  'boolean',
  'enum',
  'string_array',
]

interface CustomBlocksSectionProps {
  blocks: CustomBlock[]
  editable?: boolean
  onChange?: (blocks: CustomBlock[]) => void
}

function emptyField(): CustomBlockField {
  return {
    key: `field_${Math.random().toString(36).slice(2, 7)}`,
    label: 'New field',
    type: 'string',
    required: false,
  }
}

function starterBlock(name: string, fields: CustomBlockField[]): CustomBlock {
  const data: Record<string, unknown> = {}
  for (const f of fields) {
    if (f.type === 'boolean') data[f.key] = false
    else if (f.type === 'number') data[f.key] = 0
    else if (f.type === 'string_array') data[f.key] = []
    else data[f.key] = ''
  }
  return {
    id: crypto.randomUUID(),
    name,
    fields,
    data,
  }
}

export function CustomBlocksSection({ blocks, editable = false, onChange }: CustomBlocksSectionProps) {
  const [openBlockIds, setOpenBlockIds] = useState<Set<string>>(new Set())
  const [headerStructure, setHeaderStructure] = useState(false)
  const lastTapRef = useRef(0)
  const blockTapRefs = useRef<Record<string, number>>({})

  const updateBlock = (index: number, patch: Partial<CustomBlock>) => {
    const next = [...blocks]
    next[index] = { ...blocks[index], ...patch }
    onChange?.(next)
  }

  const setDataValue = (index: number, key: string, value: unknown) => {
    const block = blocks[index]
    updateBlock(index, { data: { ...block.data, [key]: value } })
  }

  const toggleStructure = (id: string) => {
    if (!editable) return
    setOpenBlockIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <p
          className="text-sm text-zinc-500 cursor-default select-none rounded-md px-1 -mx-1 hover:bg-white/[0.03]"
          title={editable ? 'Double-click to add structured sections' : undefined}
          onDoubleClick={() => editable && setHeaderStructure(true)}
          onTouchEnd={() => {
            const now = Date.now()
            if (now - lastTapRef.current < DOUBLE_TAP_MS) {
              lastTapRef.current = 0
              if (editable) setHeaderStructure(true)
            } else {
              lastTapRef.current = now
            }
          }}
        >
          Define fields once, then fill them like a form.
          {editable && !headerStructure ? (
            <span className="ml-2 text-[11px] text-zinc-600">Double-click to add</span>
          ) : null}
        </p>
        {editable && headerStructure && (
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() =>
                onChange?.([...blocks, starterBlock('New structured section', [emptyField()])])
              }
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="w-3.5 h-3.5" />
              Add section
            </button>
            <button
              type="button"
              onClick={() =>
                onChange?.([
                  ...blocks,
                  starterBlock('GTM checklist', [
                    {
                      key: 'channels',
                      label: 'Primary channels',
                      type: 'string_array',
                      required: true,
                    },
                    { key: 'budget', label: 'Monthly budget', type: 'string', required: false },
                    { key: 'ready', label: 'Launch ready', type: 'boolean', required: false },
                  ]),
                ])
              }
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              + GTM template
            </button>
            <button
              type="button"
              onClick={() => setHeaderStructure(false)}
              className="text-[11px] text-zinc-600 hover:text-zinc-400"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No structured sections yet.
          {editable ? ' Double-click the description above to add one.' : ''}
        </p>
      ) : (
        blocks.map((block, bi) => {
          const structureOpen = openBlockIds.has(block.id)
          return (
            <div
              key={block.id}
              className="space-y-4 pb-6 border-b border-white/[0.06] last:border-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex-1 min-w-0"
                  title={editable ? 'Double-click to edit structure' : undefined}
                  onDoubleClick={() => toggleStructure(block.id)}
                  onTouchEnd={() => {
                    const now = Date.now()
                    const last = blockTapRefs.current[block.id] ?? 0
                    if (now - last < DOUBLE_TAP_MS) {
                      blockTapRefs.current[block.id] = 0
                      toggleStructure(block.id)
                    } else {
                      blockTapRefs.current[block.id] = now
                    }
                  }}
                >
                  {structureOpen && editable ? (
                    <input
                      type="text"
                      value={block.name}
                      onChange={(e) => updateBlock(bi, { name: e.target.value })}
                      onBlur={() => {}}
                      className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/40"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-base font-medium text-white cursor-text rounded-md px-1 -mx-1 hover:bg-white/[0.03]">
                      {block.name}
                      {editable && !structureOpen ? (
                        <span className="ml-2 text-[10px] font-normal text-zinc-600">
                          Double-click to edit structure
                        </span>
                      ) : null}
                    </h3>
                  )}
                </div>
                {editable && structureOpen && (
                  <button
                    type="button"
                    onClick={() => onChange?.(blocks.filter((b) => b.id !== block.id))}
                    className="p-2 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {editable && structureOpen && (
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">Schema builder</p>
                  {block.fields.map((field, fi) => (
                    <div
                      key={field.key}
                      className="grid grid-cols-[1fr_120px_auto_auto] gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const fields = [...block.fields]
                          fields[fi] = { ...field, label: e.target.value }
                          updateBlock(bi, { fields })
                        }}
                        className="bg-transparent border border-white/[0.08] rounded px-2 py-1.5 text-xs text-zinc-200"
                        placeholder="Label"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const fields = [...block.fields]
                          fields[fi] = {
                            ...field,
                            type: e.target.value as CustomBlockFieldType,
                          }
                          updateBlock(bi, { fields })
                        }}
                        className="bg-[#0f0f0f] border border-white/[0.08] rounded px-2 py-1.5 text-xs text-zinc-300"
                      >
                        {FIELD_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <label className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const fields = [...block.fields]
                            fields[fi] = { ...field, required: e.target.checked }
                            updateBlock(bi, { fields })
                          }}
                        />
                        Req
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          updateBlock(bi, { fields: block.fields.filter((_, i) => i !== fi) })
                        }}
                        className="text-[11px] text-zinc-500 hover:text-red-400"
                      >
                        Del
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateBlock(bi, { fields: [...block.fields, emptyField()] })}
                      className="text-xs text-emerald-400"
                    >
                      + Add field
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStructure(block.id)}
                      className="text-xs text-zinc-500"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {block.fields.map((field) => {
                  const value = block.data[field.key]

                  if (field.type === 'boolean') {
                    return (
                      <label
                        key={field.key}
                        className="flex items-center gap-2 text-sm text-zinc-300"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          disabled={!editable}
                          onChange={(e) => setDataValue(bi, field.key, e.target.checked)}
                        />
                        {field.label}
                      </label>
                    )
                  }

                  if (field.type === 'string_array') {
                    const items = Array.isArray(value) ? (value as string[]) : []
                    if (!editable) {
                      return (
                        <div key={field.key}>
                          <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">
                            {field.label}
                          </p>
                          <p className="text-sm text-zinc-300">
                            {items.length ? items.join(', ') : '—'}
                          </p>
                        </div>
                      )
                    }
                    return (
                      <div key={field.key} className="space-y-1">
                        <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">
                          {field.label}
                        </p>
                        {items.map((item, ii) => (
                          <EditableField
                            key={ii}
                            value={item}
                            editable
                            onChange={(v) => {
                              const next = [...items]
                              next[ii] = v
                              setDataValue(bi, field.key, next)
                            }}
                          />
                        ))}
                        {structureOpen && (
                          <button
                            type="button"
                            onClick={() => setDataValue(bi, field.key, [...items, ''])}
                            className="text-xs text-emerald-400"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    )
                  }

                  return (
                    <EditableField
                      key={field.key}
                      label={field.label}
                      value={value == null ? '' : String(value)}
                      editable={editable}
                      onChange={(v) =>
                        setDataValue(
                          bi,
                          field.key,
                          field.type === 'number' ? Number(v) : v,
                        )
                      }
                    />
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
