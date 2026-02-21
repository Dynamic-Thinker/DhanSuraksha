"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { getClaims, mapBackendClaimToTransaction, uploadDataset } from "@/lib/api"

export default function DatasetUploadPage() {
  const { loadDataset, datasetLoaded } = useApp()
  const router = useRouter()

  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState("")
  const [uploadComplete, setUploadComplete] = useState(false)

  useEffect(() => {
    if (uploadComplete && datasetLoaded) {
      const timer = setTimeout(() => router.push("/dashboard"), 1200)
      return () => clearTimeout(timer)
    }
  }, [uploadComplete, datasetLoaded, router])

  const processFile = useCallback(
    async (file: File) => {
      setFileName(file.name)
      setUploading(true)
      setUploadProgress(20)

      try {
        await uploadDataset(file)
        setUploadProgress(70)

        const claims = await getClaims()
        const txns = claims.map(mapBackendClaimToTransaction)
        loadDataset(txns)

        setUploadProgress(100)
        setUploadComplete(true)
      } catch (error) {
        console.error(error)
        alert(error instanceof Error ? error.message : "Upload failed. Check backend.")
      } finally {
        setUploading(false)
      }
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
        <CheckCircle2 className="size-10 text-green-500" />
        <h2 className="text-xl font-semibold">Registry Loaded Successfully</h2>
        <p className="text-sm text-muted-foreground">{fileName}</p>

        <Button onClick={() => router.push("/dashboard")}>Go to Command Center</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Upload Registry Excel</CardTitle>
          <CardDescription>Upload .xlsx dataset</CardDescription>
        </CardHeader>

        <CardContent>
          {!uploading ? (
            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={e => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="size-6" />
              Drop Excel File
              <input type="file" accept=".xlsx,.xls" className="sr-only" onChange={handleFileInput} />
            </label>
          ) : (
            <div className="py-6">
              <FileSpreadsheet className="mx-auto size-10 text-primary" />
              <Progress value={uploadProgress} className="mt-4" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
