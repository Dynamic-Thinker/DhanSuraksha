"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react"

export default function FraudIntelPage() {
  const { transactions } = useApp()

  // Only show flagged transactions (risk > 50)
  const flagged = transactions
    .filter(t => t.riskScore > 50)
    .sort((a, b) => b.riskScore - a.riskScore)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Fraud Intelligence</h2>
          <p className="text-sm text-muted-foreground">
            Explainable AI audit panel for flagged transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            {flagged.length} flagged transactions
          </span>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex size-9 items-center justify-center rounded-md bg-destructive/10">
              <AlertTriangle className="size-4 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Critical Risk</p>
              <p className="text-lg font-bold font-mono text-foreground">
                {flagged.filter(t => t.riskScore > 80).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex size-9 items-center justify-center rounded-md bg-warning/10">
              <AlertTriangle className="size-4 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Elevated Risk</p>
              <p className="text-lg font-bold font-mono text-foreground">
                {flagged.filter(t => t.riskScore > 50 && t.riskScore <= 80).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex size-9 items-center justify-center rounded-md bg-success/10">
              <ShieldCheck className="size-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Auto-Blocked</p>
              <p className="text-lg font-bold font-mono text-foreground">
                {flagged.filter(t => t.status === "blocked").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Transactions */}
      <div className="flex flex-col gap-3">
        {flagged.map(t => (
          <FraudCard key={t.id} transaction={t} />
        ))}
      </div>
    </div>
  )
}

function FraudCard({ transaction: t }: { transaction: ReturnType<typeof useApp>["transactions"][0] }) {
  const [expanded, setExpanded] = useState(false)

  const riskLevel = t.riskScore > 80 ? "Critical" : t.riskScore > 60 ? "High" : "Elevated"
  const riskColorClass =
    t.riskScore > 80
      ? "text-destructive"
      : t.riskScore > 60
        ? "text-warning"
        : "text-chart-2"

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-md",
                t.riskScore > 80 ? "bg-destructive/10" : t.riskScore > 60 ? "bg-warning/10" : "bg-chart-2/10"
              )}
            >
              <span className={cn("font-mono text-sm font-bold", riskColorClass)}>
                {t.riskScore}
              </span>
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-foreground">{t.citizenHash}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {t.scheme} &middot; {t.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                riskLevel === "Critical" && "border-destructive/20 text-destructive",
                riskLevel === "High" && "border-warning/20 text-warning",
                riskLevel === "Elevated" && "border-chart-2/20 text-chart-2"
              )}
            >
              {riskLevel}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] capitalize",
                t.status === "blocked" && "border-destructive/20 text-destructive bg-destructive/5",
                t.status === "pending" && "border-warning/20 text-warning bg-warning/5",
                t.status === "approved" && "border-success/20 text-success bg-success/5",
              )}
            >
              {t.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* AI Explanation */}
        <div className="rounded-md border border-border bg-secondary/30 px-3 py-2.5 mb-3">
          <div className="flex items-start gap-2">
            <BrainCircuit className="size-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-foreground leading-relaxed">
              {t.aiExplanation}
            </p>
          </div>
        </div>

        {/* Expandable reasoning */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors"
        >
          <span>Why this transaction was {t.status === "blocked" ? "blocked" : "flagged"}</span>
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>

        {expanded && (
          <div className="mt-2 rounded-md bg-secondary/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground mb-1.5">AI Reasoning Chain:</p>
            <ol className="flex flex-col gap-1.5 list-decimal pl-4">
              <li>
                Transaction {t.id} from citizen {t.citizenHash} was analyzed against {t.scheme} scheme rules.
              </li>
              <li>
                Risk assessment model assigned a probability score of {t.riskScore}/100 based on behavioral patterns.
              </li>
              <li>
                Primary factor: {t.aiExplanation}
              </li>
              <li>
                Historical pattern analysis confirms anomalous activity relative to the beneficiary{"'"}s baseline.
              </li>
              <li>
                {t.status === "blocked"
                  ? "Automatic blocking triggered due to risk exceeding the threshold (>70)."
                  : "Transaction flagged for manual review by welfare audit officers."}
              </li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
