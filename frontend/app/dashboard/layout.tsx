"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, mode, isUnderAttack, systemStatus, hydrated } = useApp()
  const router = useRouter()
  const pathname = usePathname()
  const isOnThreatMonitor = pathname === "/dashboard/threats"

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated) {
      router.replace("/")
    } else if (!mode) {
      router.replace("/mode-select")
    }
  }, [hydrated, isAuthenticated, mode, router])

  if (!hydrated || !isAuthenticated || !mode) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="relative flex-1 overflow-y-auto">
        {mode === "demo" && (
          <div className="bg-primary/10 border-b border-primary/20 px-4 py-1.5 text-center">
            <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
              DEMO SIMULATION MODE
            </Badge>
          </div>
        )}
        {isUnderAttack && (
          <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-2 text-center animate-pulse">
            <p className="text-sm font-semibold text-destructive">
              ALERT: Unauthorized Ledger Modification Attempt Detected
            </p>
          </div>
        )}
        <div className="p-6">{children}</div>

        {/* System Freeze Overlay - not shown on Threat Monitor so user can recover */}
        {systemStatus === "FROZEN" && !isOnThreatMonitor && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-card p-8 text-center shadow-lg max-w-sm mx-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                <Lock className="size-7 text-destructive" />
              </div>
              <h2 className="text-lg font-bold text-destructive">
                System Locked
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                System Locked Due to Integrity Violation. Navigate to Threat Monitor to run recovery.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => router.push("/dashboard/threats")}
              >
                Go to Threat Monitor
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
