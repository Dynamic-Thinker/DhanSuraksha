"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"

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
  amount: number
  riskScore: number
  timestamp: string
  status: "approved" | "blocked" | "pending"
  aiExplanation: string
  previousHash: string
  currentHash: string
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
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean
  register: (user: Omit<User, "role"> & { password: string }) => boolean
  logout: () => void
  setMode: (mode: AppMode) => void
  loadDataset: (data: Transaction[]) => void
  simulateAttack: () => void
  recoverSystem: () => void
  setSystemStatus: (status: SystemStatus) => void
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
      // For live mode with datasetLoaded, generate simulated data too
      if (saved.datasetLoaded && saved.mode === "live") {
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

  const login = useCallback((email: string, _password: string): boolean => {
    setUser({
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: "Welfare Audit Officer",
      department: "Ministry of Finance",
    })
    setIsAuthenticated(true)
    return true
  }, [])

  const register = useCallback((data: Omit<User, "role"> & { password: string }): boolean => {
    setUser({
      name: data.name,
      email: data.email,
      role: "Welfare Audit Officer",
      department: data.department,
    })
    setIsAuthenticated(true)
    return true
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
    clearPersistedState()
  }, [])

  const setMode = useCallback((m: AppMode) => {
    setModeState(m)
    if (m === "demo") {
      setTransactions(generateDemoTransactions())
      setDatasetLoaded(true)
    } else {
      setTransactions([])
      setDatasetLoaded(false)
    }
    setLedgerIntegrity(99.7)
    setIsUnderAttack(false)
    setSystemStatus("ACTIVE")
  }, [])

  const loadDataset = useCallback((data: Transaction[]) => {
    setTransactions(data)
    setDatasetLoaded(true)
  }, [])

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
        login,
        register,
        logout,
        setMode,
        loadDataset,
        simulateAttack,
        recoverSystem,
        setSystemStatus,
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
