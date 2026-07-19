'use client'

interface EditableFieldProps {
  label?: string
  value: string
  editable?: boolean
  multiline?: boolean
  onChange?: (value: string) => void
  className?: string
}

export function EditableField({
  label,
  value,
  editable = false,
  multiline = false,
  onChange,
  className = '',
}: EditableFieldProps) {
  if (!editable) {
    return (
      <div className={className}>
        {label ? <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p> : null}
        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{value || '—'}</p>
      </div>
    )
  }

  const shared =
    'w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/40'

  return (
    <div className={className}>
      {label ? <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p> : null}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={4}
          className={`${shared} resize-y min-h-[96px]`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
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
  if (!editable) {
    return (
      <div>
        {label ? <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p> : null}
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {label ? <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">{label}</p> : null}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange?.(next)
              }}
              className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/40"
            />
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
          onClick={() => onChange?.([...items, ''])}
          className="text-xs text-emerald-400 hover:text-emerald-300"
        >
          + Add item
        </button>
      </div>
    </div>
  )
}
