"use client"

import { useMemo } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export function TransactionChart() {
  const { transactions } = useApp()

  const chartData = useMemo(() => {
    const grouped = new Map<string, { approved: number; blocked: number; pending: number }>()

    transactions.forEach(t => {
      const dateObj = new Date(t.timestamp)
      if (Number.isNaN(dateObj.getTime())) return

      const dateKey = dateObj.toISOString().slice(0, 10)
      const entry = grouped.get(dateKey) ?? { approved: 0, blocked: 0, pending: 0 }
      entry[t.status] += 1
      grouped.set(dateKey, entry)
    })

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([dateKey, counts]) => ({
        date: new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        ...counts,
      }))
  }, [transactions])

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Transaction Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Bar dataKey="approved" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} name="Approved" />
              <Bar dataKey="blocked" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} name="Blocked" />
              <Bar dataKey="pending" fill="hsl(var(--warning))" radius={[2, 2, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
