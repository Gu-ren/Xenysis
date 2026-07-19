'use client'

import { useEffect, useRef, useState } from 'react'

const DOUBLE_TAP_MS = 300

function useDoubleTap(onActivate: () => void) {
  const lastTapRef = useRef(0)

  return {
    onDoubleClick: (e: React.MouseEvent) => {
      e.preventDefault()
      onActivate()
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const now = Date.now()
      if (now - lastTapRef.current < DOUBLE_TAP_MS) {
        e.preventDefault()
        lastTapRef.current = 0
        onActivate()
      } else {
        lastTapRef.current = now
      }
    },
  }
}

function ListItemButton({ item, onActivate }: { item: string; onActivate: () => void }) {
  const handlers = useDoubleTap(onActivate)
  return (
    <button
      type="button"
      className="flex-1 text-left px-3 py-2 text-sm text-zinc-300 rounded-lg hover:bg-white/[0.03] cursor-text"
      title="Double-click to edit"
      {...handlers}
    >
      {item || '—'}
    </button>
  )
}

interface EditableFieldProps {
  label?: string
  value: string
  editable?: boolean
  multiline?: boolean
  onChange?: (value: string) => void
  className?: string
  /** Extra classes for the read-view value text */
  valueClassName?: string
}

export function EditableField({
  label,
  value,
  editable = false,
  multiline = false,
  onChange,
  className = '',
  valueClassName = 'text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap',
}: EditableFieldProps) {
  const [active, setActive] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const activate = () => {
    if (editable) setActive(true)
  }
  const doubleTap = useDoubleTap(activate)

  useEffect(() => {
    if (active && inputRef.current) {
      inputRef.current.focus()
      const len = inputRef.current.value.length
      inputRef.current.setSelectionRange(len, len)
    }
  }, [active])

  if (!editable) {
    return (
      <div className={className}>
        {label ? (
          <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p>
        ) : null}
        <p className={valueClassName}>{value || '—'}</p>
      </div>
    )
  }

  if (!active) {
    return (
      <div
        className={`${className} group rounded-md -mx-1 px-1 py-0.5 cursor-text transition-colors hover:bg-white/[0.03] hover:ring-1 hover:ring-white/[0.06]`}
        title="Double-click to edit"
        {...doubleTap}
      >
        {label ? (
          <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p>
        ) : null}
        <p className={valueClassName}>{value || '—'}</p>
      </div>
    )
  }

  const shared =
    'w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/40'

  const exit = () => setActive(false)

  return (
    <div className={className}>
      {label ? (
        <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p>
      ) : null}
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={exit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              exit()
            }
          }}
          rows={4}
          className={`${shared} resize-y min-h-[96px]`}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={exit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              exit()
            }
          }}
          className={shared}
        />
      )}
    </div>
  )
}

interface EditableListProps {
  label?: string
  items: string[]
  editable?: boolean
  onChange?: (items: string[]) => void
}

export function EditableList({ label, items, editable = false, onChange }: EditableListProps) {
  const [listActive, setListActive] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const activateList = () => {
    if (editable) setListActive(true)
  }
  const doubleTapList = useDoubleTap(activateList)

  useEffect(() => {
    if (activeIndex != null && inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeIndex])

  if (!editable) {
    return (
      <div>
        {label ? (
          <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p>
        ) : null}
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  if (!listActive) {
    return (
      <div
        className="rounded-md -mx-1 px-1 py-0.5 cursor-text transition-colors hover:bg-white/[0.03] hover:ring-1 hover:ring-white/[0.06]"
        title="Double-click to edit list"
        {...doubleTapList}
      >
        {label ? (
          <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p>
        ) : null}
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300">
          {items.length === 0 ? (
            <li className="text-zinc-600 list-none">Double-click to add items</li>
          ) : (
            items.map((item, i) => <li key={i}>{item || '—'}</li>)
          )}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {label ? (
        <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p>
      ) : null}
      <div
        className="space-y-2"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setListActive(false)
            setActiveIndex(null)
          }
        }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            {activeIndex === i ? (
              <input
                ref={inputRef}
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = e.target.value
                  onChange?.(next)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    setActiveIndex(null)
                    setListActive(false)
                  }
                }}
                className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/40"
              />
            ) : (
              <ListItemButton item={item} onActivate={() => setActiveIndex(i)} />
            )}
            <button
              type="button"
              onClick={() => onChange?.(items.filter((_, idx) => idx !== i))}
              className="text-xs text-zinc-500 hover:text-red-400 px-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            onChange?.([...items, ''])
            setActiveIndex(items.length)
          }}
          className="text-xs text-emerald-400 hover:text-emerald-300"
        >
          + Add item
        </button>
        <button
          type="button"
          onClick={() => {
            setListActive(false)
            setActiveIndex(null)
          }}
          className="block text-[11px] text-zinc-600 hover:text-zinc-400 mt-1"
        >
          Done
        </button>
      </div>
    </div>
  )
}
