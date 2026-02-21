"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { TransactionChart } from "@/components/dashboard/transaction-chart"
import { FraudGauge } from "@/components/dashboard/fraud-gauge"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { getDashboardMetrics } from "@/lib/api"

export default function CommandCenterPage() {
  const { datasetLoaded, mode } = useApp()
  const router = useRouter()
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    if (mode === "live" && !datasetLoaded) {
      router.replace("/dashboard/upload")
    }
  }, [mode, datasetLoaded, router])

  // 🔥 backend metrics
  useEffect(() => {
    async function load() {
      const data = await getDashboardMetrics()
      setMetrics(data)
    }
    load()
  }, [])

  if (mode === "live" && !datasetLoaded) return null

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Command Center</h2>

      <MetricCards />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TransactionChart />
        </div>
        <div className="lg:col-span-2">
          <FraudGauge />
        </div>
      </div>

      <RecentTransactions />
    </div>
  )
}