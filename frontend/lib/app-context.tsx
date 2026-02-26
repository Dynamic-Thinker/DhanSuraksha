"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import { loginOfficer, registerOfficer } from "@/lib/api"

// ─── Types ───────────────────────────────────────────────────────────────────
export type SystemStatus = "ACTIVE" | "PAUSED" | "FROZEN"
export type AppMode = "demo" | "live" | null

export interface User {
  name: string
  email: string
  role: string
  department: string
}

export interface Transaction {
  id: string
  citizenHash: string
  scheme: string
  regionCode: string
  incomeTier: "LOW" | "MEDIUM" | "HIGH"
  amount: number
  riskScore: number
  timestamp: string
  status: "approved" | "blocked" | "pending"
  aiExplanation: string
  previousHash: string
  currentHash: string
  clusterFlag?: boolean
}

export interface FraudCluster {
  citizenHash: string
  regions: string[]
  claimCount: number
}

export interface AppState {
  user: User | null
  mode: AppMode
  systemStatus: SystemStatus
  isAuthenticated: boolean
  datasetLoaded: boolean
  transactions: Transaction[]
  ledgerIntegrity: number
  fraudAttemptsBlocked: number
  totalTransactions: number
  averageRiskScore: number
  isUnderAttack: boolean
  hydrated: boolean
  fraudClusters: FraudCluster[]
  remainingBudget: number
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (user: Omit<User, "role"> & { password: string }) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  setMode: (mode: AppMode) => void
  loadDataset: (data: Transaction[]) => void
  simulateAttack: () => void
  recoverSystem: () => void
  setSystemStatus: (status: SystemStatus) => void
  freezeClusterClaims: () => void
  updateRemainingBudgetDeterministically: (budget: number) => void
  submitCitizenFundRequest: (input: { citizenId: string; amount: number; scheme: string; regionCode: string; incomeTier: "LOW" | "MEDIUM" | "HIGH" }) => void
  recalculateCitizenEligibility: (citizenId: string) => void
}

// ─── localStorage helpers ───────────────────────────────────────────────────
const STORAGE_KEY = "jdr-app-state"

interface PersistedState {
  user: User | null
  mode: AppMode
  systemStatus: SystemStatus
  isAuthenticated: boolean
  datasetLoaded: boolean
  ledgerIntegrity: number
  isUnderAttack: boolean
}

function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

function savePersistedState(state: PersistedState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

function clearPersistedState() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// ─── Demo Data Generator ────────────────────────────────────────────────────
const SCHEMES = [
  "PM-KISAN", "MGNREGA", "PM-AWAS", "Jan Dhan Yojana",
  "Ujjwala Yojana", "Ayushman Bharat", "PM-SVANidhi", "Sukanya Samriddhi"
]

const AI_EXPLANATIONS = [
  "Frequent claims detected from same household ID",
  "Claim count nearing annual threshold limit",
  "Repeated rejection pattern identified across schemes",
  "Geographic anomaly: claims from multiple districts",
  "Temporal clustering: multiple claims within 24 hours",
  "Duplicate Aadhaar hash linked to different beneficiary records",
  "Benefit amount exceeds scheme-defined maximum",
  "Inactive beneficiary account with sudden activity surge",
]

function generateHash(): string {
  return Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")
}

function generateDemoTransactions(): Transaction[] {
  const txns: Transaction[] = []
  let prevHash = "0000000000000000"

  for (let i = 0; i < 50; i++) {
    const currentHash = generateHash()
    const riskScore = Math.floor(Math.random() * 100)
    const isBlocked = riskScore > 70
    const isPending = !isBlocked && riskScore > 50

    txns.push({
      id: `TXN-${String(i + 1).padStart(4, "0")}`,
      citizenHash: `CIT-${generateHash().slice(0, 8).toUpperCase()}`,
      scheme: SCHEMES[Math.floor(Math.random() * SCHEMES.length)],
      regionCode: `RG-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}`,
      incomeTier: (["LOW", "MEDIUM", "HIGH"] as const)[Math.floor(Math.random() * 3)],
      amount: Math.floor(Math.random() * 45000) + 5000,
      riskScore,
      timestamp: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: isBlocked ? "blocked" : isPending ? "pending" : "approved",
      aiExplanation: AI_EXPLANATIONS[Math.floor(Math.random() * AI_EXPLANATIONS.length)],
      previousHash: prevHash,
      currentHash,
    })
    prevHash = currentHash
  }

  for (let i = 0; i < 5; i++) {
    const source = txns[Math.floor(Math.random() * 30)]
    const currentHash = generateHash()
    txns.push({
      ...source,
      id: `TXN-${String(txns.length + 1).padStart(4, "0")}`,
      riskScore: Math.floor(Math.random() * 30) + 70,
      status: "blocked",
      aiExplanation: "Duplicate Aadhaar hash linked to different beneficiary records",
      previousHash: prevHash,
      currentHash,
      timestamp: new Date(
        Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    prevHash = currentHash
  }

  return txns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function detectCrossRegionClusters(data: Transaction[]): FraudCluster[] {
  const byCitizen = new Map<string, { regions: Set<string>; count: number }>()

  data.forEach(txn => {
    const key = txn.citizenHash
    const entry = byCitizen.get(key) ?? { regions: new Set<string>(), count: 0 }
    entry.regions.add((txn.regionCode || "UNKNOWN").toUpperCase())
    entry.count += 1
    byCitizen.set(key, entry)
  })

  return Array.from(byCitizen.entries())
    .filter(([, value]) => value.regions.size > 1)
    .map(([citizenHash, value]) => ({ citizenHash, regions: Array.from(value.regions), claimCount: value.count }))
}

function applyCrossRegionRingRule(data: Transaction[]): { transactions: Transaction[]; clusters: FraudCluster[] } {
  const clusters = detectCrossRegionClusters(data)
  const flagged = new Set(clusters.map(c => c.citizenHash))

  const transactions = data.map((txn): Transaction => {
    if (!flagged.has(txn.citizenHash)) return { ...txn, clusterFlag: false }
    return {
      ...txn,
      status: "pending",
      clusterFlag: true,
      aiExplanation: `${txn.aiExplanation} | Cross-region duplicate identity ring detected; transactions paused for manual audit.`,
    }
  })

  return { transactions, clusters }
}


const INCOME_RANK: Record<"LOW" | "MEDIUM" | "HIGH", number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
}

function applyDeterministicBudgetRule(data: Transaction[], budget: number): { transactions: Transaction[]; remainingBudget: number } {
  const prioritized = data
    .map((txn, idx) => ({ txn, idx }))
    .sort((a, b) => {
      const byTier = INCOME_RANK[a.txn.incomeTier] - INCOME_RANK[b.txn.incomeTier]
      if (byTier !== 0) return byTier
      return new Date(a.txn.timestamp).getTime() - new Date(b.txn.timestamp).getTime()
    })

  let remaining = Math.max(0, Number.isFinite(budget) ? budget : 0)
  const updates = new Map<number, Transaction>()

  prioritized.forEach(({ txn, idx }) => {
    if (txn.status === "blocked") {
      updates.set(idx, txn)
      return
    }

    if (remaining >= txn.amount) {
      remaining -= txn.amount
      updates.set(idx, { ...txn, status: "approved" })
      return
    }

    updates.set(idx, {
      ...txn,
      status: "blocked",
      aiExplanation: `${txn.aiExplanation} | Rejected by deterministic budget rule: lower income tiers prioritized under constrained budget.`,
    })
  })

  const transactions = data.map((txn, idx) => updates.get(idx) ?? txn)
  return { transactions, remainingBudget: remaining }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [mode, setModeState] = useState<AppMode>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("ACTIVE")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [datasetLoaded, setDatasetLoaded] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [ledgerIntegrity, setLedgerIntegrity] = useState(99.7)
  const [isUnderAttack, setIsUnderAttack] = useState(false)
  const [fraudClusters, setFraudClusters] = useState<FraudCluster[]>([])
  const [remainingBudget, setRemainingBudget] = useState(0)
  const skipPersist = useRef(false)

  // ── Hydrate from localStorage on mount ──
  useEffect(() => {
    const saved = loadPersistedState()
    if (saved) {
      skipPersist.current = true
      setUser(saved.user)
      setModeState(saved.mode)
      setSystemStatus(saved.systemStatus)
      setIsAuthenticated(saved.isAuthenticated)
      setDatasetLoaded(saved.datasetLoaded)
      setLedgerIntegrity(saved.ledgerIntegrity)
      setIsUnderAttack(saved.isUnderAttack)

      // Re-generate transactions for demo mode (not persisted due to size)
      if (saved.datasetLoaded && saved.mode === "demo") {
        setTransactions(generateDemoTransactions())
      }

      requestAnimationFrame(() => {
        skipPersist.current = false
      })
    }
    setHydrated(true)
  }, [])

  // ── Persist key state to localStorage whenever it changes ──
  useEffect(() => {
    if (!hydrated || skipPersist.current) return
    savePersistedState({
      user,
      mode,
      systemStatus,
      isAuthenticated,
      datasetLoaded,
      ledgerIntegrity,
      isUnderAttack,
    })
  }, [hydrated, user, mode, systemStatus, isAuthenticated, datasetLoaded, ledgerIntegrity, isUnderAttack])

  const fraudAttemptsBlocked = transactions.filter(t => t.status === "blocked").length
  const totalTransactions = transactions.length
  const averageRiskScore = transactions.length
    ? Math.round(transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length)
    : 0

  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const result = await loginOfficer(email, password)
      setUser(result.user)
      setIsAuthenticated(true)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Login failed" }
    }
  }, [])

  const register = useCallback(async (data: Omit<User, "role"> & { password: string }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const result = await registerOfficer({
        name: data.name,
        email: data.email,
        department: data.department,
        password: data.password,
      })
      setUser(result.user)
      setIsAuthenticated(true)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Registration failed" }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    setModeState(null)
    setDatasetLoaded(false)
    setTransactions([])
    setLedgerIntegrity(99.7)
    setIsUnderAttack(false)
    setSystemStatus("ACTIVE")
    setFraudClusters([])
    setRemainingBudget(0)
    clearPersistedState()
  }, [])

  const setMode = useCallback((m: AppMode) => {
    setModeState(m)
    if (m === "demo") {
      const ruled = applyCrossRegionRingRule(generateDemoTransactions())
      setTransactions(ruled.transactions)
      setFraudClusters(ruled.clusters)
      setDatasetLoaded(true)
      setRemainingBudget(0)
    } else {
      setTransactions([])
      setFraudClusters([])
      setDatasetLoaded(false)
      setRemainingBudget(0)
    }
    setLedgerIntegrity(99.7)
    setIsUnderAttack(false)
    setSystemStatus("ACTIVE")
  }, [])

  const loadDataset = useCallback((data: Transaction[]) => {
    const ruled = applyCrossRegionRingRule(data)
    setTransactions(ruled.transactions)
    setFraudClusters(ruled.clusters)
    setDatasetLoaded(true)
    setRemainingBudget(0)

    if (ruled.clusters.length > 0) {
      setSystemStatus("PAUSED")
    }
  }, [])

  const freezeClusterClaims = useCallback(() => {
    const clusterCitizens = new Set(fraudClusters.map(cluster => cluster.citizenHash))
    if (clusterCitizens.size === 0) return

    setTransactions(prev =>
      prev.map(txn =>
        clusterCitizens.has(txn.citizenHash)
          ? { ...txn, status: "pending", clusterFlag: true }
          : txn
      )
    )
    setSystemStatus("PAUSED")
  }, [fraudClusters])

  const updateRemainingBudgetDeterministically = useCallback((budget: number) => {
    const ruled = applyDeterministicBudgetRule(transactions, budget)
    setTransactions(ruled.transactions)
    setRemainingBudget(ruled.remainingBudget)
  }, [transactions])

  const submitCitizenFundRequest = useCallback((input: {
    citizenId: string
    amount: number
    scheme: string
    regionCode: string
    incomeTier: "LOW" | "MEDIUM" | "HIGH"
  }) => {
    const currentHash = generateHash()
    const previousHash = transactions.length > 0 ? transactions[transactions.length - 1].currentHash : "GENESIS"
    const newTxn: Transaction = {
      id: `TXN-${String(transactions.length + 1).padStart(4, "0")}`,
      citizenHash: input.citizenId,
      scheme: input.scheme,
      regionCode: input.regionCode.toUpperCase(),
      incomeTier: input.incomeTier,
      amount: input.amount,
      riskScore: 25,
      timestamp: new Date().toISOString(),
      status: "pending",
      aiExplanation: "Citizen-initiated fund request submitted for eligibility review",
      previousHash,
      currentHash,
    }
    setTransactions(prev => [...prev, newTxn])
  }, [transactions])

  const recalculateCitizenEligibility = useCallback((citizenId: string) => {
    const citizenTxns = transactions.filter(t => t.citizenHash === citizenId)
    const requiredTotal = citizenTxns.filter(t => t.status !== "blocked").reduce((sum, t) => sum + t.amount, 0)
    const budget = remainingBudget > 0 ? remainingBudget : requiredTotal
    const ruled = applyDeterministicBudgetRule(transactions, budget)
    setTransactions(ruled.transactions)
    setRemainingBudget(ruled.remainingBudget)
  }, [transactions, remainingBudget])

  const simulateAttack = useCallback(() => {
    setIsUnderAttack(true)
    setSystemStatus("FROZEN")
    setLedgerIntegrity(prev => Math.max(prev - 23.4, 45))
    setTransactions(prev =>
      prev.map(t => ({
        ...t,
        riskScore: Math.min(t.riskScore + Math.floor(Math.random() * 25), 100),
      }))
    )
  }, [])

  const recoverSystem = useCallback(() => {
    setIsUnderAttack(false)
    setSystemStatus("ACTIVE")
    setLedgerIntegrity(99.7)
    setTransactions(prev =>
      prev.map(t => ({
        ...t,
        riskScore: Math.max(t.riskScore - Math.floor(Math.random() * 20), 0),
      }))
    )
  }, [])

  // ── Persist theme preference ──
  useEffect(() => {
    const saved = localStorage.getItem("jdr-theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        mode,
        systemStatus,
        isAuthenticated,
        datasetLoaded,
        transactions,
        ledgerIntegrity,
        fraudAttemptsBlocked,
        totalTransactions,
        averageRiskScore,
        isUnderAttack,
        hydrated,
        fraudClusters,
        remainingBudget,
        login,
        register,
        logout,
        setMode,
        loadDataset,
        simulateAttack,
        recoverSystem,
        setSystemStatus,
        freezeClusterClaims,
        updateRemainingBudgetDeterministically,
        submitCitizenFundRequest,
        recalculateCitizenEligibility,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
