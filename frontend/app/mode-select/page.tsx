"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Play, Upload } from "lucide-react"

export default function ModeSelectPage() {
  const { isAuthenticated, setMode, hydrated } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated) {
      router.replace("/")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !isAuthenticated) return null

  function selectMode(mode: "demo" | "live") {
    setMode(mode)
    if (mode === "demo") {
      router.push("/dashboard")
    } else {
      router.push("/dashboard/upload")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        {/* Branding */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Shield className="size-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Select Operating Mode
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Choose how you want to operate the JAN-DHANRAKSHA system. Demo mode uses simulated data; Live mode requires a real registry dataset.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Demo Mode */}
          <button onClick={() => selectMode("demo")} className="text-left">
            <Card className="h-full border-border hover:border-primary/40 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-2 group-hover:bg-primary/15 transition-colors">
                  <Play className="size-5" />
                </div>
                <CardTitle className="text-base">Demo Mode</CardTitle>
                <CardDescription className="leading-relaxed">
                  Explore the system with pre-loaded simulated welfare data, fraud cases, and duplicate records.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-primary" />
                    50+ simulated transactions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-primary" />
                    Pre-flagged fraud cases
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-primary" />
                    Cyber attack simulation enabled
                  </li>
                </ul>
              </CardContent>
            </Card>
          </button>

          {/* Live Mode */}
          <button onClick={() => selectMode("live")} className="text-left">
            <Card className="h-full border-border hover:border-primary/40 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground mb-2 group-hover:bg-secondary/80 transition-colors">
                  <Upload className="size-5" />
                </div>
                <CardTitle className="text-base">Live Mode</CardTitle>
                <CardDescription className="leading-relaxed">
                  Connect your actual registry dataset for real-time welfare integrity monitoring and fraud detection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-muted-foreground/40" />
                    Upload Excel (.xlsx) registry
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-muted-foreground/40" />
                    Automatic duplicate filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-muted-foreground/40" />
                    Real integrity verification
                  </li>
                </ul>
              </CardContent>
            </Card>
          </button>
        </div>
      </div>
    </div>
  )
}
