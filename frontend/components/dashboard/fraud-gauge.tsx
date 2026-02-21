"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export function FraudGauge() {
  const { averageRiskScore, fraudAttemptsBlocked, totalTransactions } = useApp()

  const fraudRate = totalTransactions > 0
    ? ((fraudAttemptsBlocked / totalTransactions) * 100).toFixed(1)
    : "0.0"

  const gaugeData = [
    { name: "Risk", value: averageRiskScore },
    { name: "Safe", value: 100 - averageRiskScore },
  ]

  const riskLevel =
    averageRiskScore > 60 ? "CRITICAL" : averageRiskScore > 40 ? "ELEVATED" : "NORMAL"

  const riskColor =
    averageRiskScore > 60 ? "text-destructive" : averageRiskScore > 40 ? "text-warning" : "text-success"

  return (
    <Card className="border-border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Fraud Probability
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={0}
                dataKey="value"
              >
                <Cell
                  fill={
                    averageRiskScore > 60
                      ? "hsl(var(--destructive))"
                      : averageRiskScore > 40
                        ? "hsl(var(--warning))"
                        : "hsl(var(--success))"
                  }
                />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-mono text-foreground">
              {averageRiskScore}
            </span>
            <span className="text-[10px] text-muted-foreground">Risk Score</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className={`text-xs font-bold font-mono ${riskColor}`}>
            {riskLevel}
          </span>
          <span className="text-xs text-muted-foreground">
            Fraud rate: {fraudRate}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
