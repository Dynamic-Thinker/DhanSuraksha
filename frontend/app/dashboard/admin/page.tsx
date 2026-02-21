"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  User,
  Shield,
  Database,
  RefreshCw,
  Play,
  Pause,
  Lock,
  Network,
  FileWarning,
} from "lucide-react"

export default function AdminPanelPage() {
  const {
    user,
    mode,
    systemStatus,
    setSystemStatus,
    totalTransactions,
    fraudAttemptsBlocked,
    ledgerIntegrity,
    transactions,
    fraudClusters,
    freezeClusterClaims,
    updateRemainingBudgetDeterministically,
    remainingBudget,
  } = useApp()

  const schemes = [...new Set(transactions.map(t => t.scheme))]
  const [budgetInput, setBudgetInput] = useState("0")

  const applyBudget = () => {
    const parsed = Number(budgetInput)
    if (!Number.isFinite(parsed) || parsed < 0) return
    updateRemainingBudgetDeterministically(parsed)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Admin Control Panel</h2>
        <p className="text-sm text-muted-foreground">
          System administration and configuration
        </p>
      </div>

      {/* User Info */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="size-4" />
            Officer Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Name
              </p>
              <p className="text-sm font-medium text-foreground">
                {user?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm text-foreground font-mono">
                {user?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Role
              </p>
              <p className="text-sm text-foreground">{user?.role || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Department
              </p>
              <p className="text-sm text-foreground">{user?.department || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Controls */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Shield className="size-4" />
            System Controls
          </CardTitle>
          <CardDescription>
            Manage system operating status
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Current Status:</p>
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-xs",
                systemStatus === "ACTIVE" && "border-success/30 text-success",
                systemStatus === "PAUSED" && "border-warning/30 text-warning",
                systemStatus === "FROZEN" && "border-destructive/30 text-destructive"
              )}
            >
              {systemStatus}
            </Badge>
            <Badge variant="secondary" className="text-xs font-mono">
              {mode?.toUpperCase()} MODE
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={systemStatus === "ACTIVE" ? "default" : "outline"}
              onClick={() => setSystemStatus("ACTIVE")}
              className="gap-1.5"
            >
              <Play className="size-3.5" />
              Set Active
            </Button>
            <Button
              size="sm"
              variant={systemStatus === "PAUSED" ? "default" : "outline"}
              onClick={() => setSystemStatus("PAUSED")}
              className="gap-1.5"
            >
              <Pause className="size-3.5" />
              Pause System
            </Button>
            <Button
              size="sm"
              variant={systemStatus === "FROZEN" ? "destructive" : "outline"}
              onClick={() => setSystemStatus("FROZEN")}
              className="gap-1.5"
            >
              <Lock className="size-3.5" />
              Freeze System
            </Button>
          </div>
        </CardContent>
      </Card>


      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Network className="size-4" />
            Cross-Region Duplicate Identity Ring
          </CardTitle>
          <CardDescription>
            Auto-flags citizen IDs appearing in more than one region code and pauses linked transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Active fraud clusters: <span className="font-mono text-foreground">{fraudClusters.length}</span>
            </div>
            <Button size="sm" variant="outline" onClick={freezeClusterClaims} className="gap-1.5">
              <FileWarning className="size-3.5" />
              Freeze Linked Claims
            </Button>
          </div>

          {fraudClusters.length === 0 ? (
            <p className="text-xs text-muted-foreground">No cross-region duplicate clusters detected.</p>
          ) : (
            <div className="space-y-2">
              {fraudClusters.map(cluster => (
                <div key={cluster.citizenHash} className="rounded-md border border-warning/30 bg-warning/5 p-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-foreground">{cluster.citizenHash}</span>
                    <Badge variant="outline" className="border-warning/40 text-warning">
                      {cluster.claimCount} linked claims paused
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Regions: {cluster.regions.join(", ")} | Cluster status: AUTO-FLAGGED
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">Update remaining budget deterministically</CardTitle>
          <CardDescription>
            If Budget &lt; Required_Total, the engine prioritizes LOW income tier first and rejects higher tiers when funds are exhausted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Available Budget</label>
              <input
                type="number"
                min={0}
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <Button size="sm" onClick={applyBudget}>Apply Deterministic Allocation</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Remaining Budget after allocation: <span className="font-mono text-foreground">₹{remainingBudget.toLocaleString("en-IN")}</span>
          </p>
        </CardContent>
      </Card>

      {/* System Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Database className="size-4" />
              Data Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total Records</span>
                <span className="font-mono text-xs text-foreground">{totalTransactions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Blocked</span>
                <span className="font-mono text-xs text-destructive">{fraudAttemptsBlocked}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Approved</span>
                <span className="font-mono text-xs text-success">
                  {transactions.filter(t => t.status === "approved").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Pending</span>
                <span className="font-mono text-xs text-warning">
                  {transactions.filter(t => t.status === "pending").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <RefreshCw className="size-4" />
              Active Schemes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {schemes.map(s => (
                <Badge key={s} variant="secondary" className="text-[10px]">
                  {s}
                </Badge>
              ))}
              {schemes.length === 0 && (
                <p className="text-xs text-muted-foreground">No data loaded</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="size-4" />
              Integrity Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ledger Integrity</span>
                <span
                  className={cn(
                    "font-mono text-xs font-bold",
                    ledgerIntegrity > 95 ? "text-success" : ledgerIntegrity > 70 ? "text-warning" : "text-destructive"
                  )}
                >
                  {ledgerIntegrity.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Hash Verification</span>
                <span className={cn(
                  "font-mono text-xs",
                  ledgerIntegrity > 95 ? "text-success" : "text-destructive"
                )}>
                  {ledgerIntegrity > 95 ? "PASSING" : "FAILING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last Audit</span>
                <span className="font-mono text-xs text-foreground">
                  {new Date().toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
