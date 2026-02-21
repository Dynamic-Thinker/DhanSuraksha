"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { simulateAttack as apiAttack } from "@/lib/api"
import {
  ShieldAlert,
  Zap,
  RotateCcw,
  AlertTriangle,
  Shield,
  Lock,
  FileWarning,
} from "lucide-react"

export default function ThreatMonitorPage() {
  const {
    isUnderAttack,
    simulateAttack,
    recoverSystem,
    systemStatus,
    ledgerIntegrity,
  } = useApp()

  const [showIncident, setShowIncident] = useState(false)

  async function handleAttack() {
  await apiAttack() // backend trigger
  simulateAttack()  // UI freeze
  setShowIncident(true)
}

  function handleRecover() {
    recoverSystem()
    setShowIncident(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Threat Monitor</h2>
          <p className="text-sm text-muted-foreground">
            Cyber attack simulation and system defense monitoring
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "font-mono text-xs",
            systemStatus === "ACTIVE" && "border-success/30 text-success",
            systemStatus === "PAUSED" && "border-warning/30 text-warning",
            systemStatus === "FROZEN" && "border-destructive/30 text-destructive animate-pulse"
          )}
        >
          {systemStatus}
        </Badge>
      </div>

      {/* Attack control */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <ShieldAlert className="size-4" />
            Attack Simulation Console
          </CardTitle>
          <CardDescription>
            Simulate a ledger tampering attack to test system defenses
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleAttack}
              disabled={isUnderAttack}
              className="gap-2"
            >
              <Zap className="size-4" />
              Simulate Cyber Attack
            </Button>
            {isUnderAttack && (
              <Button
                variant="outline"
                onClick={handleRecover}
                className="gap-2 border-success/30 text-success hover:bg-success/5 hover:text-success"
              >
                <RotateCcw className="size-4" />
                Run Integrity Verification
              </Button>
            )}
          </div>

          {isUnderAttack && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 animate-pulse">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive" />
                <p className="text-sm font-semibold text-destructive">
                  Unauthorized Ledger Modification Attempt Detected
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System status cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 pt-5">
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-md",
                isUnderAttack ? "bg-destructive/10" : "bg-success/10"
              )}
            >
              <Shield
                className={cn(
                  "size-4",
                  isUnderAttack ? "text-destructive" : "text-success"
                )}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Defense Status</p>
              <p className={cn(
                "text-sm font-bold",
                isUnderAttack ? "text-destructive" : "text-success"
              )}>
                {isUnderAttack ? "COMPROMISED" : "SECURE"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center gap-3 pt-5">
            <div className={cn(
              "flex size-9 items-center justify-center rounded-md",
              ledgerIntegrity > 95 ? "bg-success/10" : ledgerIntegrity > 70 ? "bg-warning/10" : "bg-destructive/10"
            )}>
              <Lock className={cn(
                "size-4",
                ledgerIntegrity > 95 ? "text-success" : ledgerIntegrity > 70 ? "text-warning" : "text-destructive"
              )} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ledger Integrity</p>
              <p className={cn(
                "text-sm font-bold font-mono",
                ledgerIntegrity > 95 ? "text-success" : ledgerIntegrity > 70 ? "text-warning" : "text-destructive"
              )}>
                {ledgerIntegrity.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="flex items-center gap-3 pt-5">
            <div className={cn(
              "flex size-9 items-center justify-center rounded-md",
              systemStatus === "FROZEN" ? "bg-destructive/10" : "bg-success/10"
            )}>
              <FileWarning className={cn(
                "size-4",
                systemStatus === "FROZEN" ? "text-destructive" : "text-success"
              )} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">System Lock</p>
              <p className={cn(
                "text-sm font-bold",
                systemStatus === "FROZEN" ? "text-destructive" : "text-success"
              )}>
                {systemStatus === "FROZEN" ? "LOCKED DOWN" : "OPERATIONAL"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incident Report */}
      {showIncident && isUnderAttack && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Incident Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Attack Type
                </p>
                <p className="text-sm font-medium text-foreground">Ledger Tampering</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Detection Method
                </p>
                <p className="text-sm font-medium text-foreground">
                  Hash Chain Verification Failure
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Response
                </p>
                <p className="text-sm font-medium text-foreground">
                  Automatic System Lockdown
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Timestamp
                </p>
                <p className="text-sm font-mono text-foreground">
                  {new Date().toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Severity
                </p>
                <Badge variant="destructive" className="text-[10px]">
                  CRITICAL
                </Badge>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Affected Records
                </p>
                <p className="text-sm font-mono text-foreground">
                  3 ledger blocks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery confirmation */}
      {showIncident && !isUnderAttack && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex size-9 items-center justify-center rounded-md bg-success/10">
              <Shield className="size-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success">System Recovered</p>
              <p className="text-xs text-muted-foreground">
                Integrity verification complete. All ledger hashes restored to valid state.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
