"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BookOpenCheck,
  BrainCircuit,
  ShieldAlert,
  Settings,
  LogOut,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/lib/app-context"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/dashboard/ledger", label: "Ledger Explorer", icon: BookOpenCheck },
  { href: "/dashboard/fraud", label: "AI Fraud Intel", icon: BrainCircuit },
  { href: "/dashboard/threats", label: "Threat Monitor", icon: ShieldAlert },
  { href: "/dashboard/admin", label: "Admin Panel", icon: Settings },
  { href: "/dashboard/upload", label: "Dataset Upload", icon: Upload },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, mode, systemStatus, logout, isUnderAttack } = useApp()

  function handleLogout() {
    logout()
    router.push("/")
  }

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-success text-success-foreground",
    PAUSED: "bg-warning text-warning-foreground",
    FROZEN: "bg-destructive text-white",
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Header */}
      <div className="flex flex-col gap-1 px-5 py-5 border-b border-sidebar-border">
        <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">
          JAN-DHANRAKSHA
        </h1>
        <p className="text-[11px] text-sidebar-foreground/60 leading-tight">
          National Welfare Integrity Engine
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              "inline-block size-2 rounded-full",
              systemStatus === "ACTIVE" && "bg-success",
              systemStatus === "PAUSED" && "bg-warning",
              systemStatus === "FROZEN" && "bg-destructive animate-pulse"
            )}
          />
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0 font-mono border-sidebar-border",
              statusColor[systemStatus]
            )}
          >
            {systemStatus}
          </Badge>
          {mode && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-mono bg-sidebar-accent text-sidebar-accent-foreground"
            >
              {mode.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {isUnderAttack && (
            <Badge variant="destructive" className="text-[10px] animate-pulse">
              THREAT
            </Badge>
          )}
        </div>
        {user && (
          <div className="mt-2 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium truncate text-sidebar-foreground">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
              aria-label="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
