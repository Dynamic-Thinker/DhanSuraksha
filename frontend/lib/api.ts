import { API_BASE_URL } from "@/lib/config"

export interface AuthUser {
  name: string
  email: string
  role: string
  department: string
}

export interface DashboardSummary {
  total_transactions: number
  fraud_detected: number
  avg_risk_score: number
  ledger_integrity: number
}

export interface BackendClaim {
  citizen_id?: string
  Citizen_ID?: string
  scheme_amount?: number
  Scheme_Amount?: number
  scheme_eligibility?: string
  Scheme_Eligibility?: string
  risk_score?: number
  Risk_Score?: number
  account_status?: string
  Account_Status?: string
  claim_count?: number
  Claim_Count?: number
  aadhaar_verified?: string
  Aadhaar_Verified?: string
  last_claim_date?: string
  Last_Claim_Date?: string
  [key: string]: unknown
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(`${API_BASE_URL}${path}`, init)
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to backend API. Start backend server on port 8000 or set NEXT_PUBLIC_API in frontend/.env.local."
      )
    }
    throw error
  }

  const payload = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "detail" in payload && String(payload.detail)) ||
      `Request failed: ${res.status}`
    throw new Error(message)
  }

  return payload as T
}

export async function loginOfficer(email: string, password: string) {
  return request<{ message: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
}

export async function registerOfficer(data: {
  name: string
  email: string
  department: string
  password: string
}) {
  return request<{ message: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export function mapBackendClaimToTransaction(claim: BackendClaim, index: number) {
  const citizenId = (claim.citizen_id ?? claim.Citizen_ID ?? `CIT-${index + 1}`).toString()
  const amount = Number(claim.scheme_amount ?? claim.Scheme_Amount ?? 0)
  const riskScore = Number(claim.risk_score ?? claim.Risk_Score ?? 0)
  const accountStatus = String(claim.account_status ?? claim.Account_Status ?? "").toUpperCase()
  const scheme = String(claim.scheme_eligibility ?? claim.Scheme_Eligibility ?? "Welfare Scheme")
  const rawTimestamp = String(claim.last_claim_date ?? claim.Last_Claim_Date ?? "")
  const timestamp = Number.isNaN(Date.parse(rawTimestamp)) ? new Date().toISOString() : new Date(rawTimestamp).toISOString()

  return {
    id: `TXN-${String(index + 1).padStart(4, "0")}`,
    citizenHash: citizenId,
    scheme,
    amount: Number.isFinite(amount) ? amount : 0,
    riskScore: Number.isFinite(riskScore) ? riskScore : 0,
    timestamp,
    status: riskScore > 70 ? "blocked" : accountStatus === "PENDING" ? "pending" : "approved",
    aiExplanation: `Claims: ${claim.claim_count ?? claim.Claim_Count ?? "N/A"}, Aadhaar: ${claim.aadhaar_verified ?? claim.Aadhaar_Verified ?? "N/A"}`,
    previousHash: "GENESIS",
    currentHash: `${citizenId}-${index}`,
  } as const
}

export async function uploadDataset(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  return request<{ message: string; summary: { summary: DashboardSummary } }>("/upload", {
    method: "POST",
    body: formData,
  })
}

export async function getDashboardMetrics() {
  return request<{ summary: DashboardSummary; transactions: BackendClaim[] }>("/dashboard")
}

export async function getClaims() {
  return request<BackendClaim[]>("/claims")
}

export async function getFraudAlerts() {
  return request<{ alerts: BackendClaim[] }>("/fraud-alerts")
}

export async function simulateAttack() {
  return request<{ status: string; threat: string; severity: string; recommended_action: string }>("/simulate-attack")
}
