import type { BlueprintContent } from '../types/blueprint-api'

const EXPORT_WIDTH_PX = 900
const COVER_HEIGHT_PX = Math.round(EXPORT_WIDTH_PX * (841.89 / 595.28))
const CANVAS_SCALE = 2
const SECTION_GAP_PX = 12
const FOOTER_RESERVED_PX = 28
const HORIZONTAL_MARGIN_PX = 48

export interface ExportBlueprintOptions {
  generatedAt?: string
  logoUrl?: string
}

function label(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function ul(items: string[]): string {
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
}

function field(key: string, value: string): string {
  return `<p><span class="field-key">${esc(key)}:</span> ${esc(value)}</p>`
}

function section(id: string, title: string, body: string): string {
  return `<section id="${id}"><h2>${esc(title)}</h2>${body}</section>`
}

function formatDate(iso?: string): string {
  const date = iso ? new Date(iso) : new Date()
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function getBlueprintExportStyles(): string {
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #111;
      background: #fff;
      padding: 48px 56px;
      max-width: ${EXPORT_WIDTH_PX}px;
      margin: 0 auto;
    }
    header, section {
      padding-left: 56px;
      padding-right: 56px;
    }
    header { margin-bottom: 40px; border-bottom: 2px solid #111; padding-bottom: 20px; }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
    }
    .logo {
      height: 28px;
      width: 28px;
      border-radius: 6px;
      display: block;
    }
    .brand-name {
      font-size: 15px;
      font-weight: 600;
      color: #111;
      letter-spacing: -0.2px;
    }
    header h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    header .meta { font-size: 12px; color: #555; margin-top: 6px; }
    section { margin-bottom: 36px; page-break-inside: avoid; }
    h2 {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
      margin-bottom: 14px;
      color: #111;
    }
    h3 { font-size: 14px; font-weight: 600; margin: 16px 0 8px; color: #222; }
    h4 { font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #222; }
    p { margin-bottom: 8px; }
    .field-key { font-weight: 600; color: #374151; }
    ul { padding-left: 18px; margin-bottom: 10px; }
    ul li { margin-bottom: 3px; }
    .sub-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 12px;
      background: #fafafa;
      page-break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11px;
      table-layout: fixed;
      word-break: break-word;
    }
    th { background: #f3f4f6; font-weight: 600; text-align: left; padding: 7px 10px; border: 1px solid #e5e7eb; }
    td { padding: 6px 10px; border: 1px solid #e5e7eb; vertical-align: top; word-break: break-word; }
    tr:nth-child(even) td { background: #fafafa; }
    .badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      padding: 1px 7px;
      border-radius: 999px;
      background: #dcfce7;
      color: #166534;
      vertical-align: middle;
      margin-left: 6px;
    }
    .badge-critical { background: #fee2e2; color: #991b1b; }
    .badge-high     { background: #fef3c7; color: #92400e; }
    .badge-medium   { background: #dbeafe; color: #1e40af; }
    .badge-low      { background: #f3f4f6; color: #374151; }
    .cover-page {
      width: ${EXPORT_WIDTH_PX}px;
      height: ${COVER_HEIGHT_PX}px;
      background: #0a0a0a;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 72px 64px 64px;
      position: relative;
      overflow: hidden;
      page-break-after: always;
    }
    .cover-page::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.18), transparent 60%),
        radial-gradient(ellipse 60% 40% at 100% 100%, rgba(16, 185, 129, 0.08), transparent 55%);
      pointer-events: none;
    }
    .cover-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: linear-gradient(to bottom, black 20%, transparent 85%);
      pointer-events: none;
    }
    .cover-accent-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #059669, #34d399, #059669);
    }
    .cover-top,
    .cover-center,
    .cover-bottom {
      position: relative;
      z-index: 1;
    }
    .cover-top {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cover-logo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: block;
    }
    .cover-brand {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.3px;
      color: rgba(255, 255, 255, 0.9);
    }
    .cover-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #34d399;
      margin-bottom: 20px;
    }
    .cover-title {
      font-size: 42px;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.8px;
      color: #fff;
      margin-bottom: 24px;
      max-width: 90%;
    }
    .cover-subtitle {
      font-size: 15px;
      line-height: 1.65;
      color: rgba(255, 255, 255, 0.45);
      max-width: 85%;
    }
    .cover-divider {
      width: 48px;
      height: 3px;
      background: linear-gradient(90deg, #10b981, transparent);
      margin: 32px 0;
      border-radius: 2px;
    }
    .cover-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 8px;
    }
    .cover-chip {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid rgba(16, 185, 129, 0.25);
      background: rgba(16, 185, 129, 0.08);
      color: #6ee7b7;
    }
    .cover-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;
    }
    .cover-date {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.35);
      letter-spacing: 0.04em;
    }
    .cover-edition {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.25);
      text-align: right;
    }
    .cover-spine {
      position: absolute;
      left: 28px;
      top: 120px;
      bottom: 120px;
      width: 2px;
      background: linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.35), transparent);
    }
    @media print {
      body { padding: 0; }
      @page { margin: 20mm 18mm; size: A4; }
      section { page-break-inside: avoid; }
      .sub-card { page-break-inside: avoid; }
    }
  `
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

function blueprintCoverHtml(content: BlueprintContent, options?: ExportBlueprintOptions): string {
  const { overview, problem, customer } = content
  const generatedLabel = formatDate(options?.generatedAt)
  const logoImg = options?.logoUrl
    ? `<img src="${esc(options.logoUrl)}" alt="Xenysis" class="cover-logo" />`
    : ''

  const subtitle = truncateText(
    overview.positionStatement || overview.coreValueProposition,
    220,
  )
  const severityLabel = label(problem.problemSeverity)
  const primarySegment = customer.segments.find((s) => s.isPrimaryBuyer)?.name
    ?? customer.segments[0]?.name
    ?? truncateText(customer.icp.title, 40)

  return `
  <div class="cover-page">
    <div class="cover-accent-bar"></div>
    <div class="cover-grid"></div>
    <div class="cover-spine"></div>

    <div class="cover-top">
      ${logoImg}
      <span class="cover-brand">Xenysis</span>
    </div>

    <div class="cover-center">
      <p class="cover-label">Startup Blueprint</p>
      <h1 class="cover-title">${esc(overview.tagline)}</h1>
      <div class="cover-divider"></div>
      <p class="cover-subtitle">${esc(subtitle)}</p>
      <div class="cover-meta-row">
        <span class="cover-chip">${esc(severityLabel)} Problem</span>
        <span class="cover-chip">${esc(primarySegment)}</span>
        <span class="cover-chip">Build-Ready</span>
      </div>
    </div>

    <div class="cover-bottom">
      <p class="cover-date">Generated ${esc(generatedLabel)}</p>
      <p class="cover-edition">Confidential · Founder Edition</p>
    </div>
  </div>
  `
}

export function blueprintToHtmlBody(content: BlueprintContent, options?: ExportBlueprintOptions): string {
  const { overview, problem, customer, solution, businessModel, personas, userJourneys, mvpScope, requirements, roadmap, risks, metrics, customSections = [], customBlocks = [] } = content
  const generatedLabel = formatDate(options?.generatedAt)

  const overviewHtml = section('overview', 'Overview', `
    ${field('Tagline', overview.tagline)}
    ${field('Position Statement', overview.positionStatement)}
    ${field('Core Value Proposition', overview.coreValueProposition)}
    ${field('Target Market', overview.targetMarketSummary)}
  `)

  const problemHtml = section('problem', 'Problem', `
    ${field('Statement', problem.statement)}
    ${field('Severity', label(problem.problemSeverity))}
    ${field('Why Now', problem.whyNow)}
    <p><span class="field-key">Pain Points:</span></p>${ul(problem.painPoints)}
    <p><span class="field-key">Current Alternatives:</span></p>${ul(problem.currentAlternatives)}
  `)

  const segmentsHtml = customer.segments.map((s) => `
    <div class="sub-card">
      <h4>${esc(s.name)}${s.isPrimaryBuyer ? ' <span class="badge">Primary</span>' : ''}</h4>
      <p>${esc(s.description)}</p>
      ${field('Estimated Size', s.estimatedSize)}
      <p><span class="field-key">Characteristics:</span></p>${ul(s.characteristics)}
    </div>
  `).join('')

  const customerHtml = section('customer', 'Customer', `
    <h3>ICP: ${esc(customer.icp.title)}</h3>
    <p>${esc(customer.icp.description)}</p>
    ${field('Job to be Done', customer.icp.jobToBeDone)}
    ${field('Buyer vs User', label(customer.icp.buyerVsUser))}
    <h3>Segments</h3>
    ${segmentsHtml}
  `)

  const solutionHtml = section('solution', 'Solution', `
    <p>${esc(solution.description)}</p>
    <p><span class="field-key">Core Capabilities:</span></p>${ul(solution.coreCapabilities)}
    <p><span class="field-key">Differentiators:</span></p>${ul(solution.differentiators)}
    ${solution.unfairAdvantage ? field('Unfair Advantage', solution.unfairAdvantage) : ''}
    ${solution.technologyApproach ? field('Technology Approach', solution.technologyApproach) : ''}
  `)

  const streamsHtml = `<ul>${businessModel.revenueStreams.map((rs) =>
    `<li><strong>${esc(label(rs.type))}${rs.isPrimary ? ' (Primary)' : ''}:</strong> ${esc(rs.description)} — <em>${esc(rs.pricingHypothesis)}</em></li>`
  ).join('')}</ul>`

  const businessModelHtml = section('business-model', 'Business Model', `
    ${field('GTM Motion', label(businessModel.gtmMotion))}
    ${field('Go-to-Market', businessModel.goToMarketSummary)}
    ${field('Unit Economics', businessModel.unitEconomicsHypothesis)}
    <p><span class="field-key">Revenue Streams:</span></p>${streamsHtml}
    <p><span class="field-key">Key Channels:</span></p>${ul(businessModel.keyChannels)}
  `)

  const personasHtml = section('personas', 'Personas', personas.personas.map((p) => `
    <div class="sub-card">
      <h4>${esc(p.name)}${p.isPrimary ? ' <span class="badge">Primary</span>' : ''} — ${esc(p.role)}</h4>
      ${field('Demographics', p.demographics)}
      ${field('Tech Savviness', label(p.techSavviness))}
      <p><span class="field-key">Goals:</span></p>${ul(p.goals)}
      <p><span class="field-key">Frustrations:</span></p>${ul(p.frustrations)}
      <p><span class="field-key">Behaviors:</span></p>${ul(p.behaviors)}
    </div>
  `).join(''))

  const journeysHtml = section('user-journeys', 'User Journeys', userJourneys.journeys.map((j) => `
    <div class="sub-card">
      <h4>${esc(j.personaName)} — ${esc(j.scenario)}</h4>
      <table>
        <thead><tr><th>Stage</th><th>Action</th><th>Emotion</th><th>Pain Point</th><th>Opportunity</th></tr></thead>
        <tbody>${j.stages.map((s) => `<tr>
          <td>${esc(s.stage)}</td>
          <td>${esc(s.action)}</td>
          <td>${esc(label(s.emotion))}</td>
          <td>${s.painPoint ? esc(s.painPoint) : '—'}</td>
          <td>${s.opportunity ? esc(s.opportunity) : '—'}</td>
        </tr>`).join('')}</tbody>
      </table>
      ${field('Key Insight', j.keyInsight)}
    </div>
  `).join(''))

  const priorities = ['must_have', 'should_have', 'nice_to_have', 'wont_have'] as const
  const scopeHtml = priorities.map((p) => {
    const items = mvpScope.scope.filter((s) => s.priority === p)
    if (!items.length) return ''
    return `<p><span class="field-key">${label(p)}:</span></p><ul>${items.map((s) => `<li><strong>${esc(s.feature)}</strong> — ${esc(s.rationale)}</li>`).join('')}</ul>`
  }).join('')

  const mvpHtml = section('mvp-scope', 'MVP Scope', `
    ${field('Hypothesis', mvpScope.hypothesis)}
    ${field('Success Criteria', mvpScope.successCriteria)}
    ${field('Estimated Build Time', mvpScope.estimatedBuildTime)}
    ${scopeHtml}
    <p><span class="field-key">Out of Scope:</span></p>${ul(mvpScope.outOfScope)}
  `)

  const reqRows = (reqs: typeof requirements.functional) =>
    `<table><thead><tr><th>ID</th><th>Category</th><th>Priority</th><th>Description</th><th>Acceptance Criteria</th></tr></thead><tbody>${reqs.map((r) =>
      `<tr><td>${esc(r.id)}</td><td>${esc(r.category)}</td><td>${esc(label(r.priority))}</td><td>${esc(r.description)}</td><td>${esc(r.acceptanceCriteria)}</td></tr>`
    ).join('')}</tbody></table>`

  const requirementsHtml = section('requirements', 'Requirements', `
    <h3>Functional</h3>${reqRows(requirements.functional)}
    <h3>Non-Functional</h3>${reqRows(requirements.nonFunctional)}
  `)

  const roadmapHtml = section('roadmap', 'Roadmap', `
    ${field('Total Timeline', roadmap.totalEstimatedTimeline)}
    ${field('Critical Path', roadmap.criticalPath)}
    ${roadmap.milestones.map((m) => `
      <div class="sub-card">
        <h4>Phase ${m.phase}: ${esc(m.name)}</h4>
        <p>${esc(m.description)}</p>
        ${field('Duration', m.estimatedDuration)}
        ${field('Success Metric', m.successMetric)}
        <p><span class="field-key">Deliverables:</span></p>${ul(m.deliverables)}
        ${m.dependencies.length ? field('Dependencies', m.dependencies.join(', ')) : ''}
      </div>
    `).join('')}
  `)

  const risksHtml = section('risks', 'Risks', risks.risks.map((r) => `
    <div class="sub-card">
      <h4>${esc(r.title)} <span class="badge badge-${r.severity}">${esc(label(r.severity))}</span></h4>
      <p><span class="field-key">${esc(label(r.category))}</span></p>
      <p>${esc(r.description)}</p>
      ${field('Mitigation', r.mitigation)}
      ${r.phase != null ? field('Phase', String(r.phase)) : ''}
    </div>
  `).join(''))

  const { northStar } = metrics
  const metricsHtml = section('metrics', 'Metrics', `
    <div class="sub-card">
      <h4>North Star: ${esc(northStar.name)}</h4>
      <p>${esc(northStar.description)}</p>
      ${field('Target', northStar.target)}
      ${field('Rationale', northStar.rationale)}
    </div>
    <h3>Key Metrics</h3>
    <table>
      <thead><tr><th>Name</th><th>Category</th><th>Phase</th><th>Description</th><th>Target</th></tr></thead>
      <tbody>${metrics.metrics.map((m) => `
        <tr>
          <td>${esc(m.name)}</td>
          <td>${esc(label(m.category))}</td>
          <td>${m.phase}</td>
          <td>${esc(m.description)}</td>
          <td>${esc(m.target)}</td>
        </tr>
      `).join('')}</tbody>
    </table>
  `)

  const logoImg = options?.logoUrl
    ? `<img src="${esc(options.logoUrl)}" alt="Xenysis" class="logo" />`
    : ''

  return `
  ${blueprintCoverHtml(content, options)}
  <header>
    <div class="brand-row">
      ${logoImg}
      <span class="brand-name">Xenysis</span>
    </div>
    <h1>${esc(overview.tagline)}</h1>
    <p class="meta">Startup Blueprint &nbsp;·&nbsp; Generated ${esc(generatedLabel)}</p>
  </header>
  ${overviewHtml}
  ${problemHtml}
  ${customerHtml}
  ${solutionHtml}
  ${businessModelHtml}
  ${personasHtml}
  ${journeysHtml}
  ${mvpHtml}
  ${requirementsHtml}
  ${roadmapHtml}
  ${risksHtml}
  ${metricsHtml}
  ${customSections.length ? section('custom-sections', 'Custom Sections', customSections.map((s) => `
    <div class="sub-card">
      <h4>${esc(s.title)}</h4>
      <p>${esc(s.body)}</p>
    </div>
  `).join('')) : ''}
  ${customBlocks.length ? section('custom-blocks', 'Structured Sections', customBlocks.map((b) => `
    <div class="sub-card">
      <h4>${esc(b.name)}</h4>
      ${b.fields.map((f) => {
        const v = b.data[f.key]
        const display = Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v ?? '')
        return field(f.label, display)
      }).join('')}
    </div>
  `).join('')) : ''}
  `
}

export function blueprintToHtmlDocument(
  content: BlueprintContent,
  filename: string,
  options?: ExportBlueprintOptions,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(filename)}</title>
  <style>${getBlueprintExportStyles()}</style>
</head>
<body>
  ${blueprintToHtmlBody(content, options)}
</body>
</html>`
}

async function renderExportIframe(html: string): Promise<{ iframe: HTMLIFrameElement; doc: Document }> {
  const iframe = document.createElement('iframe')
  iframe.style.cssText = `position:fixed;left:-9999px;top:0;width:${EXPORT_WIDTH_PX}px;height:0;border:0;visibility:hidden;`
  document.body.appendChild(iframe)

  await new Promise<void>((resolve, reject) => {
    iframe.onload = () => resolve()
    iframe.onerror = () => reject(new Error('Failed to render blueprint for export'))
    const doc = iframe.contentDocument
    if (!doc) {
      reject(new Error('Failed to access export frame'))
      return
    }
    doc.open()
    doc.write(html)
    doc.close()
  })

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

  const doc = iframe.contentDocument
  if (!doc) throw new Error('Failed to access export frame')

  return { iframe, doc }
}

async function waitForImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images)
  await Promise.all(
    images.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            }),
    ),
  )
}

function addPageFooters(
  pdf: InstanceType<typeof import('jspdf').default>,
  dateLabel: string,
  hasCover = false,
): void {
  const total = pdf.getNumberOfPages()
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const contentPages = hasCover ? total - 1 : total

  for (let i = 1; i <= total; i++) {
    if (hasCover && i === 1) continue

    pdf.setPage(i)
    pdf.setFontSize(9)
    pdf.setTextColor(120, 120, 120)
    const pageNum = hasCover ? i - 1 : i
    pdf.text(
      `Xenysis · ${dateLabel} · Page ${pageNum} of ${contentPages}`,
      pageW / 2,
      pageH - 12,
      { align: 'center' },
    )
  }
}

async function renderCoverPage(
  pdf: InstanceType<typeof import('jspdf').default>,
  cover: HTMLElement,
  html2canvas: typeof import('html2canvas').default,
): Promise<void> {
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  const canvas = await html2canvas(cover, {
    scale: CANVAS_SCALE,
    useCORS: true,
    backgroundColor: '#0a0a0a',
    windowWidth: EXPORT_WIDTH_PX,
    height: COVER_HEIGHT_PX,
  })

  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH)
}

function addImageSlice(
  pdf: InstanceType<typeof import('jspdf').default>,
  imgData: string,
  imgW: number,
  imgH: number,
  y: number,
): void {
  pdf.addImage(imgData, 'PNG', HORIZONTAL_MARGIN_PX, y, imgW, imgH)
}

function placeBlockOnPdf(
  pdf: InstanceType<typeof import('jspdf').default>,
  imgData: string,
  imgW: number,
  imgH: number,
  contentHeight: number,
  state: { cursorY: number },
): void {
  let remaining = imgH
  let offset = 0

  while (remaining > 0) {
    const available = contentHeight - state.cursorY
    if (available <= 0) {
      pdf.addPage()
      state.cursorY = 0
      continue
    }

    const sliceHeight = Math.min(remaining, available)
    const yPosition = state.cursorY - offset

    addImageSlice(pdf, imgData, imgW, imgH, yPosition)

    offset += sliceHeight
    remaining -= sliceHeight
    state.cursorY += sliceHeight

    if (remaining > 0) {
      pdf.addPage()
      state.cursorY = 0
    }
  }

  if (state.cursorY < contentHeight) {
    state.cursorY += SECTION_GAP_PX
  }
}

export async function exportBlueprintAsPdf(
  content: BlueprintContent,
  slug: string,
  options?: ExportBlueprintOptions,
): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ])

  const exportOptions: ExportBlueprintOptions = {
    ...options,
    logoUrl: options?.logoUrl ?? `${window.location.origin}/logo.svg`,
  }
  const html = blueprintToHtmlDocument(content, slug, exportOptions)
  const dateLabel = formatDate(options?.generatedAt)
  const { iframe, doc } = await renderExportIframe(html)

  try {
    await waitForImages(doc)

    const cover = doc.querySelector('.cover-page') as HTMLElement | null
    const blocks = Array.from(doc.body.querySelectorAll('header, section'))
    if (!blocks.length) throw new Error('No blueprint content to export')

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const contentW = pageW - 2 * HORIZONTAL_MARGIN_PX
    const contentHeight = pageH - FOOTER_RESERVED_PX
    const state = { cursorY: 0 }

    if (cover) {
      await renderCoverPage(pdf, cover, html2canvas)
      pdf.addPage()
    }

    for (const block of blocks) {
      const canvas = await html2canvas(block as HTMLElement, {
        scale: CANVAS_SCALE,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: EXPORT_WIDTH_PX,
      })

      const imgData = canvas.toDataURL('image/png')
      const imgW = contentW
      const imgH = (canvas.height * imgW) / canvas.width

      if (state.cursorY > 0 && state.cursorY + imgH > contentHeight) {
        pdf.addPage()
        state.cursorY = 0
      }

      placeBlockOnPdf(pdf, imgData, imgW, imgH, contentHeight, state)
    }

    addPageFooters(pdf, dateLabel, Boolean(cover))
    pdf.save(`${slug}.pdf`)
  } finally {
    document.body.removeChild(iframe)
  }
}
