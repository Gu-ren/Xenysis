interface SectionHeadingProps {
  number: string
  title: string
}

export function SectionHeading({ number, title }: SectionHeadingProps) {
  return (
    <div className="mb-10 pt-16 first:pt-0">
      <span className="text-[10px] font-semibold tracking-[0.18em] text-emerald-500 uppercase mb-2.5 block">
        Section {number}
      </span>
      <h2 className="text-[28px] font-bold text-white tracking-tight leading-tight">{title}</h2>
    </div>
  )
}
