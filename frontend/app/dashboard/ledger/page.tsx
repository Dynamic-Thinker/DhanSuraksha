"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ArrowRight, AlertTriangle, Lock } from "lucide-react"

export default function LedgerExplorerPage() {
  const { transactions, ledgerIntegrity, isUnderAttack } = useApp()

  // Show complete dataset chain
  const chain = transactions

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Ledger Explorer</h2>
          <p className="text-sm text-muted-foreground">
            Blockchain-style ledger chain visualization across all uploaded records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Integrity:</span>
            <span
              className={cn(
                "font-mono text-sm font-bold",
                ledgerIntegrity > 95 ? "text-success" :
                ledgerIntegrity > 70 ? "text-warning" : "text-destructive"
              )}
            >
              {ledgerIntegrity.toFixed(1)}%
            </span>
          </div>
          {isUnderAttack && (
            <Badge variant="destructive" className="animate-pulse text-[10px]">
              CHAIN COMPROMISED
            </Badge>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Total blocks: {chain.length}</p>

      {/* Chain visualization */}
      <div className="flex flex-col gap-0">
        {chain.map((block, idx) => {
          const integrityBroken = isUnderAttack && idx > chain.length - 4
          return (
            <div key={block.id} className="flex flex-col items-center">
              {/* Block */}
              <Card
                className={cn(
                  "w-full border transition-colors",
                  integrityBroken
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {block.id}
                        </span>
                        {integrityBroken && (
                          <AlertTriangle className="size-3.5 text-destructive" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(block.timestamp).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Data grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Citizen Hash</p>
                        <p className="font-mono text-xs text-foreground">{block.citizenHash}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Scheme</p>
                        <p className="text-xs text-foreground">{block.scheme}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Amount</p>
                        <p className="font-mono text-xs text-foreground">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(block.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Status</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize",
                            block.status === "approved" && "border-success/20 text-success",
                            block.status === "blocked" && "border-destructive/20 text-destructive",
                            block.status === "pending" && "border-warning/20 text-warning",
                          )}
                        >
                          {block.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Hashes */}
                    <div className="flex flex-col gap-1 rounded-md bg-secondary/50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16 shrink-0">
                          Prev Hash
                        </span>
                        <code
                          className={cn(
                            "font-mono text-[10px] truncate",
                            integrityBroken ? "text-destructive" : "text-muted-foreground"
                          )}
                        >
                          {block.previousHash}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-16 shrink-0">
                          Curr Hash
                        </span>
                        <code className="font-mono text-[10px] text-foreground truncate">
                          {block.currentHash}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chain connector */}
              {idx < chain.length - 1 && (
                <div className="flex flex-col items-center py-1">
                  <div
                    className={cn(
                      "h-4 w-px",
                      integrityBroken ? "bg-destructive/50" : "bg-border"
                    )}
                  />
                  <ArrowRight
                    className={cn(
                      "size-3 rotate-90",
                      integrityBroken ? "text-destructive/50" : "text-muted-foreground/30"
                    )}
                  />
                  <div
                    className={cn(
                      "h-4 w-px",
                      integrityBroken ? "bg-destructive/50" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
