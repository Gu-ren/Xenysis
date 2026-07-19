import { CheckCircle2, Plus } from 'lucide-react'
import { SectionHeading } from '../ui/section-heading'
import { EditableField, EditableList } from '../ui/editable-field'
import type { BlueprintMvpScope } from '../types/blueprint-api'

interface MvpScopeSectionProps {
  mvpScope: BlueprintMvpScope
  percentage?: number
  editable?: boolean
  onChange?: (mvpScope: BlueprintMvpScope) => void
}

export function MvpScopeSection({
  mvpScope,
  percentage,
  editable = false,
  onChange,
}: MvpScopeSectionProps) {
  const includedItems = mvpScope.scope.filter(
    (item) => item.priority === 'must_have' || item.priority === 'should_have',
  )

  return (
    <section id="mvp-scope">
      <SectionHeading number="08" title="MVP Scope" percentage={percentage} />

      {(mvpScope.hypothesis || editable) && (
        <div className="mb-6">
          <EditableField
            value={
              editable
                ? mvpScope.hypothesis
                : mvpScope.hypothesis
                  ? `Hypothesis: ${mvpScope.hypothesis}`
                  : ''
            }
            editable={editable}
            multiline
            onChange={(hypothesis) => onChange?.({ ...mvpScope, hypothesis })}
            valueClassName="text-sm text-zinc-600 italic leading-relaxed whitespace-pre-wrap"
          />
        </div>
      )}

      {editable && (
        <div className="mb-6 space-y-3">
          <EditableField
            label="Success criteria"
            value={mvpScope.successCriteria}
            editable
            multiline
            onChange={(successCriteria) => onChange?.({ ...mvpScope, successCriteria })}
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="bg-[#0a0a0a] p-8">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500 mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Included in MVP
          </h4>
          {editable ? (
            <div className="space-y-2">
              {includedItems.map((item) => {
                const idx = mvpScope.scope.indexOf(item)
                return (
                  <EditableField
                    key={idx}
                    value={item.feature}
                    editable
                    onChange={(feature) => {
                      const scope = [...mvpScope.scope]
                      scope[idx] = { ...item, feature }
                      onChange?.({ ...mvpScope, scope })
                    }}
                    valueClassName="text-[11px] text-emerald-400/90"
                  />
                )
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {includedItems.map((item) => (
                <span
                  key={item.feature}
                  className="px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] text-[11px] text-emerald-400/90"
                >
                  {item.feature}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0a0a0a] p-8">
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 mb-5 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 rotate-45" />
            Not Included Yet
          </h4>
          {editable ? (
            <EditableList
              items={mvpScope.outOfScope}
              editable
              onChange={(outOfScope) => onChange?.({ ...mvpScope, outOfScope })}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {mvpScope.outOfScope.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] text-[11px] text-zinc-600"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {(mvpScope.estimatedBuildTime || editable) && (
        <div className="mt-4 text-center">
          <EditableField
            value={
              editable
                ? mvpScope.estimatedBuildTime
                : `Estimated build time: ${mvpScope.estimatedBuildTime}`
            }
            editable={editable}
            onChange={(estimatedBuildTime) => onChange?.({ ...mvpScope, estimatedBuildTime })}
            valueClassName="text-xs text-zinc-700"
          />
        </div>
      )}
    </section>
  )
}
