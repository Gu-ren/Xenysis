import type { BlueprintContent } from '../types/blueprint-api'

function score(filled: number, total: number): number {
  return Math.round(Math.min(100, (filled / Math.max(total, 1)) * 100))
}

function countStrings(arr: string[]): number {
  return arr.filter((s) => s && s.trim().length > 0).length
}

export function computeAllSectionScores(content: BlueprintContent): Record<string, number> {
  const { overview, problem, customer, solution, businessModel, personas, userJourneys, mvpScope, requirements, roadmap, risks } = content

  // Overview: 4 string fields
  const overviewFilled =
    (overview.tagline ? 1 : 0) +
    (overview.positionStatement ? 1 : 0) +
    (overview.coreValueProposition ? 1 : 0) +
    (overview.targetMarketSummary ? 1 : 0)
  const overviewScore = score(overviewFilled, 4)

  // Problem: statement + painPoints (min 2) + currentAlternatives + whyNow + severity
  const problemFilled =
    (problem.statement ? 1 : 0) +
    Math.min(problem.painPoints.length, 3) +
    Math.min(problem.currentAlternatives.length, 2) +
    (problem.whyNow ? 1 : 0) +
    (problem.problemSeverity ? 1 : 0)
  const problemScore = score(problemFilled, 8)

  // Customer: icp fields + segments
  const icpFilled =
    (customer.icp.title ? 1 : 0) +
    (customer.icp.description ? 1 : 0) +
    (customer.icp.jobToBeDone ? 1 : 0) +
    (customer.icp.buyerVsUser ? 1 : 0)
  const segmentsFilled = Math.min(customer.segments.length, 3)
  const customerScore = score(icpFilled + segmentsFilled, 7)

  // Solution: description + capabilities + differentiators + advantage
  const solutionFilled =
    (solution.description ? 1 : 0) +
    Math.min(solution.coreCapabilities.length, 3) +
    Math.min(solution.differentiators.length, 2) +
    (solution.unfairAdvantage ? 1 : 0) +
    (solution.technologyApproach ? 1 : 0)
  const solutionScore = score(solutionFilled, 8)

  // Business Model: revenue streams + channels + gtm + economics
  const bmFilled =
    Math.min(businessModel.revenueStreams.length, 2) +
    Math.min(businessModel.keyChannels.length, 3) +
    (businessModel.goToMarketSummary ? 1 : 0) +
    (businessModel.unitEconomicsHypothesis ? 1 : 0)
  const businessModelScore = score(bmFilled, 7)

  // Personas: count personas × fields per persona
  const personasCount = personas.personas.length
  const personasFilled = personas.personas.reduce((sum, p) => {
    return (
      sum +
      (p.name ? 1 : 0) +
      (p.role ? 1 : 0) +
      Math.min(p.goals.length, 2) +
      Math.min(p.frustrations.length, 2)
    )
  }, 0)
  const personasScore = score(personasFilled, Math.max(personasCount, 1) * 6)

  // User Journeys: journeys × stages
  const journeysCount = userJourneys.journeys.length
  const journeysFilled = userJourneys.journeys.reduce((sum, j) => {
    return sum + (j.scenario ? 1 : 0) + Math.min(j.stages.length, 4) + (j.keyInsight ? 1 : 0)
  }, 0)
  const userJourneysScore = score(journeysFilled, Math.max(journeysCount, 1) * 6)

  // MVP Scope: hypothesis + scope items + successCriteria + buildTime
  const mvpFilled =
    (mvpScope.hypothesis ? 1 : 0) +
    (mvpScope.successCriteria ? 1 : 0) +
    Math.min(mvpScope.scope.length, 5) +
    Math.min(mvpScope.outOfScope.length, 2) +
    (mvpScope.estimatedBuildTime ? 1 : 0)
  const mvpScopeScore = score(mvpFilled, 10)

  // Requirements: functional + non-functional
  const reqFilled =
    Math.min(requirements.functional.length, 6) +
    Math.min(requirements.nonFunctional.length, 3)
  const requirementsScore = score(reqFilled, 9)

  // Roadmap: milestones with deliverables
  const roadmapFilled =
    Math.min(roadmap.milestones.length, 4) +
    roadmap.milestones.reduce((sum, m) => sum + Math.min(m.deliverables.length, 2), 0) +
    (roadmap.criticalPath ? 1 : 0)
  const roadmapScore = score(roadmapFilled, 10)

  // Risks: count risks per category
  const risksFilled = Math.min(risks.risks.length, 6)
  const risksScore = score(risksFilled, 6)

  return {
    overview:       overviewScore,
    problem:        problemScore,
    customer:       customerScore,
    solution:       solutionScore,
    'business-model': businessModelScore,
    personas:       personasScore,
    'user-journeys': userJourneysScore,
    'mvp-scope':    mvpScopeScore,
    requirements:   requirementsScore,
    roadmap:        roadmapScore,
    risks:          risksScore,
  }
}
