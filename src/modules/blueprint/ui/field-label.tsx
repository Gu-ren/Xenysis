export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 mb-1.5">
      {children}
    </p>
  )
}
