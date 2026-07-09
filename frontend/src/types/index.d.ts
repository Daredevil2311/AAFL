export interface SimulateRequest {
  modelFiles: { name: string; path?: string }[]
  attackFiles: { name: string; path?: string }[]
  attackType: "Label Flip" | "Manzantan" | "Backdoor" | "Cycle" | "Freeride" | "Scaling"
  intensityPercent: number
  numClients: number
  clients?: number[]
  userId?: string
}

export interface ProgressMessage {
  jobId: string
  stage:
    | "preprocessing"
    | "split_clients"
    | "load_models"
    | "train_local_models"
    | "apply_attack"
    | "aggregate"
    | "evaluate"
    | "save_results"
  percent: number
  message: string
  timestamp: string
}

export interface ClientMetric {
  clientId: number
  f1: number
  precision: number
  recall: number
  accuracy: number
}

export interface GlobalMetrics {
  f1: number
  precision: number
  recall: number
  accuracy: number
}

export interface AttackResult {
  jobId: string
  attack: string
  intensityPercent: number
  clientsAttacked: number[]
  metrics: {
    perClient: ClientMetric[]
    baselineGlobal: GlobalMetrics
    attackedGlobal: GlobalMetrics
  }
  plots?: { [key: string]: string }
  csvs?: { per_client_metrics?: string; global_metrics?: string }
  logs?: string[]
  verdict?: { label: "Safe" | "Warning" | "Compromised"; explanation: string }
  createdAt?: string
}

export interface Job {
  jobId: string
  userId: string
  attackType: string
  intensityPercent: number
  numClients: number
  status: "running" | "completed" | "cancelled"
  percent: number
  createdAt: string
  result?: AttackResult
}

export interface AuthContextType {
  user: { id: string; email: string } | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export interface JobContextType {
  jobs: Job[]
  currentJob: Job | null
  addJob: (job: Job) => void
  updateJob: (jobId: string, updates: Partial<Job>) => void
  setCurrentJob: (job: Job | null) => void
  getJobById: (jobId: string) => Job | undefined
}
