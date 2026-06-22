import type { BlueprintContent } from '../types/blueprint-api'

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

function blueprintToHtml(content: BlueprintContent, filename: string): string {
  const { overview, problem, customer, solution, businessModel, personas, userJourneys, mvpScope, requirements, roadmap, risks, metrics } = content
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // Overview
  const overviewHtml = section('overview', 'Overview', `
    ${field('Tagline', overview.tagline)}
    ${field('Position Statement', overview.positionStatement)}
    ${field('Core Value Proposition', overview.coreValueProposition)}
    ${field('Target Market', overview.targetMarketSummary)}
  `)

  // Problem
  const problemHtml = section('problem', 'Problem', `
    ${field('Statement', problem.statement)}
    ${field('Severity', label(problem.problemSeverity))}
    ${field('Why Now', problem.whyNow)}
    <p><span class="field-key">Pain Points:</span></p>${ul(problem.painPoints)}
    <p><span class="field-key">Current Alternatives:</span></p>${ul(problem.currentAlternatives)}
  `)

  // Customer
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

  // Solution
  const solutionHtml = section('solution', 'Solution', `
    <p>${esc(solution.description)}</p>
    <p><span class="field-key">Core Capabilities:</span></p>${ul(solution.coreCapabilities)}
    <p><span class="field-key">Differentiators:</span></p>${ul(solution.differentiators)}
    ${solution.unfairAdvantage ? field('Unfair Advantage', solution.unfairAdvantage) : ''}
    ${solution.technologyApproach ? field('Technology Approach', solution.technologyApproach) : ''}
  `)

  // Business Model
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

  // Personas
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

  // User Journeys
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

  // MVP Scope
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

  // Requirements
  const reqRows = (reqs: typeof requirements.functional) =>
    `<table><thead><tr><th>ID</th><th>Category</th><th>Priority</th><th>Description</th><th>Acceptance Criteria</th></tr></thead><tbody>${reqs.map((r) =>
      `<tr><td>${esc(r.id)}</td><td>${esc(r.category)}</td><td>${esc(label(r.priority))}</td><td>${esc(r.description)}</td><td>${esc(r.acceptanceCriteria)}</td></tr>`
    ).join('')}</tbody></table>`

  const requirementsHtml = section('requirements', 'Requirements', `
    <h3>Functional</h3>${reqRows(requirements.functional)}
    <h3>Non-Functional</h3>${reqRows(requirements.nonFunctional)}
  `)

  // Roadmap
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

  // Risks
  const risksHtml = section('risks', 'Risks', risks.risks.map((r) => `
    <div class="sub-card">
      <h4>${esc(r.title)} <span class="badge badge-${r.severity}">${esc(label(r.severity))}</span></h4>
      <p><span class="field-key">${esc(label(r.category))}</span></p>
      <p>${esc(r.description)}</p>
      ${field('Mitigation', r.mitigation)}
      ${r.phase != null ? field('Phase', String(r.phase)) : ''}
    </div>
  `).join(''))

  // Metrics
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(filename)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #111;
      background: #fff;
      padding: 48px 56px;
      max-width: 900px;
      margin: 0 auto;
    }
    header { margin-bottom: 40px; border-bottom: 2px solid #111; padding-bottom: 20px; }
    header h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    header .meta { font-size: 12px; color: #555; margin-top: 6px; }
    header .accent { color: #16a34a; font-weight: 600; }
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
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px; }
    th { background: #f3f4f6; font-weight: 600; text-align: left; padding: 7px 10px; border: 1px solid #e5e7eb; }
    td { padding: 6px 10px; border: 1px solid #e5e7eb; vertical-align: top; }
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
    @media print {
      body { padding: 0; }
      @page { margin: 20mm 18mm; size: A4; }
      section { page-break-inside: avoid; }
      .sub-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${esc(overview.tagline)}</h1>
    <p class="meta">Startup Blueprint &nbsp;·&nbsp; <span class="accent">Xenysis</span> &nbsp;·&nbsp; ${esc(date)}</p>
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
</body>
</html>`
}

export async function exportBlueprintAsPdf(content: BlueprintContent, slug: string): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ])

  const html = blueprintToHtml(content, slug)

  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:900px;background:#fff;'
  container.innerHTML = html
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 900,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })

    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgW = pageW
    const imgH = (canvas.height * imgW) / canvas.width
    const totalPages = Math.ceil(imgH / pageH)

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, -i * pageH, imgW, imgH)
    }

    pdf.save(`${slug}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}
