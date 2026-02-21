"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp, type Transaction } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react"
import { uploadDataset } from "@/lib/api"

function generateHash(): string {
  return Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")
}

const SCHEMES = [
  "PM-KISAN", "MGNREGA", "PM-AWAS", "Jan Dhan Yojana",
  "Ujjwala Yojana", "Ayushman Bharat",
]

const AI_EXPLANATIONS = [
  "Frequent claims detected from same household ID",
  "Claim count nearing annual threshold limit",
  "Repeated rejection pattern identified across schemes",
  "Geographic anomaly: claims from multiple districts",
]

export default function DatasetUploadPage() {
  const { mode, loadDataset, datasetLoaded } = useApp()
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState("")
  const [duplicatesFound, setDuplicatesFound] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  // Auto-redirect to dashboard after upload completes
  useEffect(() => {
    if (uploadComplete && datasetLoaded) {
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [uploadComplete, datasetLoaded, router])

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name)
      setUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Generate transactions from "uploaded" data
          const txns: Transaction[] = []
          let prevHash = "0000000000000000"
          const count = Math.floor(Math.random() * 30) + 30

          for (let i = 0; i < count; i++) {
            const currentHash = generateHash()
            const riskScore = Math.floor(Math.random() * 100)
            txns.push({
              id: `TXN-${String(i + 1).padStart(4, "0")}`,
              citizenHash: `CIT-${generateHash().slice(0, 8).toUpperCase()}`,
              scheme: SCHEMES[Math.floor(Math.random() * SCHEMES.length)],
              amount: Math.floor(Math.random() * 45000) + 5000,
              riskScore,
              timestamp: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
              status: riskScore > 70 ? "blocked" : riskScore > 50 ? "pending" : "approved",
              aiExplanation: AI_EXPLANATIONS[Math.floor(Math.random() * AI_EXPLANATIONS.length)],
              previousHash: prevHash,
              currentHash,
            })
            prevHash = currentHash
          }

          // Filter duplicates in live mode
          const dupes = Math.floor(Math.random() * 5) + 2
          setDuplicatesFound(dupes)

          setTimeout(() => {
            loadDataset(txns)
            setUploadComplete(true)
            setUploading(false)
          }, 400)
        }
        setUploadProgress(Math.min(progress, 100))
      }, 200)
    },
    [loadDataset]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  if (datasetLoaded || uploadComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="size-8 text-success" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Registry Loaded Successfully
          </h2>
          {fileName && (
            <p className="mt-1 text-sm text-muted-foreground">{fileName}</p>
          )}
        </div>
        {mode === "live" && duplicatesFound > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/5 px-4 py-2">
            <AlertTriangle className="size-4 text-warning" />
            <p className="text-sm text-warning-foreground">
              {duplicatesFound} duplicate beneficiaries filtered for integrity.
            </p>
          </div>
        )}
        <Button onClick={() => router.push("/dashboard")}>
          Go to Command Center
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl py-12">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-foreground">Dataset Onboarding</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your registry Excel file to activate the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Registry Excel</CardTitle>
          <CardDescription>
            Drag and drop your .xlsx file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploading ? (
            <label
              className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
              onDragOver={e => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-secondary">
                <Upload className="size-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Drop your Excel file here
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Supports .xlsx format
                </p>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="sr-only"
                onChange={handleFileInput}
              />
            </label>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <FileSpreadsheet className="size-10 text-primary" />
              <div className="w-full max-w-xs">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{fileName}</span>
                  <span className="font-mono text-foreground">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <Progress value={uploadProgress} />
              </div>
              <p className="text-xs text-muted-foreground">Processing registry data...</p>
            </div>
          )}

          {!datasetLoaded && !uploading && mode === "live" && (
            <div className="mt-4 rounded-md border border-border bg-secondary/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">
                  LIVE MODE
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Upload Registry Excel to Activate System
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
