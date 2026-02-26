"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type IncomeTier = "LOW" | "MEDIUM" | "HIGH"

interface CitizenAccount {
  citizenId: string
  password: string
}

const STORAGE_KEY = "jdr-citizen-accounts"

function loadAccounts(): CitizenAccount[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CitizenAccount[]
  } catch {
    return []
  }
}

function saveAccounts(accounts: CitizenAccount[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
}

export default function CitizenPortalPage() {
  const {
    transactions,
    submitCitizenFundRequest,
    recalculateCitizenEligibility,
    remainingBudget,
  } = useApp()

  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [citizenId, setCitizenId] = useState("")
  const [password, setPassword] = useState("")
  const [loggedCitizen, setLoggedCitizen] = useState<string | null>(null)
  const [authError, setAuthError] = useState("")

  const [amount, setAmount] = useState("2000")
  const [scheme, setScheme] = useState("Welfare Scheme")
  const [regionCode, setRegionCode] = useState("RG-01")
  const [incomeTier, setIncomeTier] = useState<IncomeTier>("LOW")

  const citizenTxns = useMemo(
    () => transactions.filter(txn => loggedCitizen && txn.citizenHash === loggedCitizen),
    [transactions, loggedCitizen]
  )

  const pendingCount = citizenTxns.filter(t => t.status === "pending").length

  const onAuth = () => {
    setAuthError("")
    const id = citizenId.trim().toUpperCase()

    if (!id || !password) {
      setAuthError("Citizen ID and password are required")
      return
    }

    const accounts = loadAccounts()

    if (mode === "signup") {
      if (accounts.some(a => a.citizenId === id)) {
        setAuthError("Citizen ID already registered")
        return
      }
      accounts.push({ citizenId: id, password })
      saveAccounts(accounts)
      setLoggedCitizen(id)
      return
    }

    const found = accounts.find(a => a.citizenId === id && a.password === password)
    if (!found) {
      setAuthError("Invalid citizen credentials")
      return
    }

    setLoggedCitizen(id)
  }

  if (!loggedCitizen) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Citizen Portal</CardTitle>
            <CardDescription>
              {mode === "signin" ? "Sign in with Citizen ID" : "Create account with Citizen ID"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant={mode === "signin" ? "default" : "outline"} onClick={() => setMode("signin")}>Sign In</Button>
              <Button variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>Sign Up</Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="citizen-id">Citizen ID</Label>
              <Input id="citizen-id" value={citizenId} onChange={e => setCitizenId(e.target.value)} placeholder="e.g. 336084485286" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="citizen-password">Password</Label>
              <Input id="citizen-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create / Enter password" />
            </div>

            {authError && <p className="text-sm text-destructive">{authError}</p>}

            <Button className="w-full" onClick={onAuth}>
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Officer login? <Link href="/" className="text-primary hover:underline">Go to officer console</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Citizen Service Portal</h1>
        <Badge variant="secondary">Citizen: {loggedCitizen}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Funds</CardTitle>
          <CardDescription>Submit a new request for welfare disbursal.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Scheme</Label>
            <Input value={scheme} onChange={e => setScheme(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Region Code</Label>
            <Input value={regionCode} onChange={e => setRegionCode(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Income Tier</Label>
            <select
              value={incomeTier}
              onChange={e => setIncomeTier(e.target.value as IncomeTier)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Button
              onClick={() =>
                submitCitizenFundRequest({
                  citizenId: loggedCitizen,
                  amount: Number(amount) || 0,
                  scheme,
                  regionCode,
                  incomeTier,
                })
              }
            >
              Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eligibility Recalculation</CardTitle>
          <CardDescription>
            Recalculate pending requests with deterministic budget rule (LOW tier first when budget is constrained).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Pending requests: {pendingCount}</p>
          <p className="text-sm text-muted-foreground">Remaining budget in system: ₹{remainingBudget.toLocaleString("en-IN")}</p>
          <Button variant="outline" onClick={() => recalculateCitizenEligibility(loggedCitizen)}>
            Recalculate eligibility for pending transactions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
          <CardDescription>All linked transactions for this Citizen ID.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {citizenTxns.length === 0 && <p className="text-sm text-muted-foreground">No requests found.</p>}
            {citizenTxns.map(txn => (
              <div key={txn.id} className="rounded-md border border-border p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs">{txn.id}</span>
                  <Badge variant="outline">{txn.status.toUpperCase()}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {txn.scheme} • {txn.regionCode} • {txn.incomeTier} • ₹{txn.amount.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
