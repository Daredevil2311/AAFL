import axios, { type AxiosInstance } from "axios"
import type { SimulateRequest, ProgressMessage, AttackResult } from "../types"

const MOCK_MODE = true
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

let apiClient: AxiosInstance

if (!MOCK_MODE) {
  apiClient = axios.create({
    baseURL: BASE_URL,
  })
} else {
  // Mock client that does nothing
  apiClient = axios.create({
    baseURL: BASE_URL,
  })
}

export interface APIClient {
  simulate: (request: SimulateRequest) => Promise<{ jobId: string }>
  getProgress: (jobId: string) => Promise<ProgressMessage>
  getResults: (jobId: string) => Promise<AttackResult>
  cancelJob: (jobId: string) => Promise<void>
}

// Real API calls would go here
const realAPI: APIClient = {
  async simulate(request: SimulateRequest) {
    const response = await apiClient.post("/simulate", request)
    return response.data
  },
  async getProgress(jobId: string) {
    const response = await apiClient.get(`/simulate/${jobId}/status`)
    return response.data
  },
  async getResults(jobId: string) {
    const response = await apiClient.get(`/simulate/${jobId}/results`)
    return response.data
  },
  async cancelJob(jobId: string) {
    await apiClient.post(`/simulate/${jobId}/cancel`)
  },
}

export default {
  ...realAPI,
  // Set MOCK_MODE = false and update BASE_URL to use real backend
}
