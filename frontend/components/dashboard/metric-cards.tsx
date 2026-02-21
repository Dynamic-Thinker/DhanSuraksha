"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, ShieldX, Gauge, Lock } from "lucide-react"

export function MetricCards() {
  const { totalTransactions, fraudAttemptsBlocked, averageRiskScore, ledgerIntegrity } = useApp()

  const metrics = [
    {
      label: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      icon: Activity,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Fraud Attempts Blocked",
      value: fraudAttemptsBlocked.toLocaleString(),
      icon: ShieldX,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Average Risk Score",
      value: `${averageRiskScore}/100`,
      icon: Gauge,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Ledger Integrity",
      value: `${ledgerIntegrity.toFixed(1)}%`,
      icon: Lock,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map(m => (
        <Card key={m.label} className="border-border">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className={`flex size-10 items-center justify-center rounded-lg ${m.bgColor}`}>
              <m.icon className={`size-5 ${m.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-xl font-bold text-foreground font-mono">{m.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
