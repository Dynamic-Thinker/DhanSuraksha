"use client"

import { useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { getClaims } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function RecentTransactions() {
  const { transactions, loadDataset } = useApp()

  // 🔥 fetch claims
  useEffect(() => {
    getClaims().then(data => {
      loadDataset(data.transactions || [])
    })
  }, [loadDataset])

  const recent = transactions.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>

      <CardContent>
        <table className="w-full text-sm">
          <tbody>
            {recent.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.scheme}</td>
                <td>{t.amount}</td>
                <td>
                  <Badge>{t.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}