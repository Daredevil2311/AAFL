import { v4 as uuid } from "uuid"
import type { SimulateRequest, ProgressMessage, AttackResult, ClientMetric } from "../types"

const STAGES = [
  "preprocessing",
  "split_clients",
  "load_models",
  "train_local_models",
  "apply_attack",
  "aggregate",
  "evaluate",
  "save_results",
] as const
const STAGE_DURATIONS = [800, 600, 400, 2000, 1500, 1200, 800, 600] // ms per stage

export class MockSimulator {
  private activeJobs: Map<string, { request: SimulateRequest; controller: AbortController; progress: number }> =
    new Map()

  async simulate(request: SimulateRequest, onProgress: (msg: ProgressMessage) => void): Promise<AttackResult> {
    const jobId = uuid()
    const controller = new AbortController()
    this.activeJobs.set(jobId, { request, controller, progress: 0 })

    try {
      // Simulate stages
      let totalTime = 0
      for (let i = 0; i < STAGES.length; i++) {
        if (controller.signal.aborted) throw new Error("Job cancelled")

        const stage = STAGES[i]
        const duration = STAGE_DURATIONS[i]
        const stageStartTime = Date.now()

        // Simulate progress within stage
        while (Date.now() - stageStartTime < duration) {
          if (controller.signal.aborted) throw new Error("Job cancelled")

          const elapsed = Date.now() - stageStartTime
          const stagProgress = Math.min(elapsed / duration, 1)
          const totalProgress = (i + stagProgress) / STAGES.length

          onProgress({
            jobId,
            stage,
            percent: Math.round(totalProgress * 100),
            message: `Running ${stage}...`,
            timestamp: new Date().toISOString(),
          })

          await new Promise((r) => setTimeout(r, 100))
        }

        totalTime += duration
      }

      // Generate results
      const result = this.generateResults(jobId, request)
      this.activeJobs.delete(jobId)
      return result
    } catch (err) {
      this.activeJobs.delete(jobId)
      throw err
    }
  }

  cancel(jobId: string) {
    const job = this.activeJobs.get(jobId)
    if (job) {
      job.controller.abort()
    }
  }

  private generateResults(jobId: string, request: SimulateRequest): AttackResult {
    // Simulate baseline metrics
    const baselineF1 = 0.95 + Math.random() * 0.04
    const attackSensitivity: Record<string, number> = {
      "Label Flip": 0.15,
      Manzantan: 0.25,
      Backdoor: 0.35,
      Cycle: 0.2,
      Freeride: 0.1,
      Scaling: 0.18,
    }

    const intensity = request.intensityPercent / 100
    const sensitivity = attackSensitivity[request.attackType] || 0.15
    const f1Delta = intensity * sensitivity
    const attackedF1 = Math.max(baselineF1 - f1Delta, 0.5)

    // Generate per-client metrics
    const perClient: ClientMetric[] = []
    for (let i = 1; i <= request.numClients; i++) {
      const isAttacked = !request.clients || request.clients.includes(i)
      const clientDelta = isAttacked ? f1Delta * (0.8 + Math.random() * 0.4) : f1Delta * Math.random() * 0.1
      perClient.push({
        clientId: i,
        f1: Math.max(baselineF1 - clientDelta, 0.4),
        precision: Math.max(baselineF1 - clientDelta * 0.8, 0.5),
        recall: Math.max(baselineF1 - clientDelta * 1.1, 0.4),
        accuracy: Math.max(baselineF1 - clientDelta * 0.7, 0.6),
      })
    }

    // Determine verdict
    const f1Drop = ((baselineF1 - attackedF1) / baselineF1) * 100
    let verdictLabel: "Safe" | "Warning" | "Compromised"
    let explanation = ""

    if (f1Drop < 5) {
      verdictLabel = "Safe"
      explanation = "Model is robust against this attack. No significant performance degradation detected."
    } else if (f1Drop < 25) {
      verdictLabel = "Warning"
      explanation = `Model shows moderate vulnerability (${f1Drop.toFixed(1)}% F1 drop). Consider defense mechanisms like aggregation rules.`
    } else {
      verdictLabel = "Compromised"
      explanation = `Model is highly vulnerable (${f1Drop.toFixed(1)}% F1 drop). Implement Byzantine-robust aggregation immediately.`
    }

    return {
      jobId,
      attack: request.attackType,
      intensityPercent: request.intensityPercent,
      clientsAttacked: request.clients || Array.from({ length: request.numClients }, (_, i) => i + 1),
      metrics: {
        perClient,
        baselineGlobal: {
          f1: baselineF1,
          precision: baselineF1 - 0.02,
          recall: baselineF1 - 0.01,
          accuracy: baselineF1 - 0.015,
        },
        attackedGlobal: {
          f1: attackedF1,
          precision: attackedF1 - 0.025,
          recall: attackedF1 - 0.02,
          accuracy: attackedF1 - 0.018,
        },
      },
      logs: [],
      verdict: { label: verdictLabel, explanation },
      createdAt: new Date().toISOString(),
    }
  }
}

export const mockSimulator = new MockSimulator()
