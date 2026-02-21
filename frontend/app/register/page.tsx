"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff, Check, X } from "lucide-react"
import Link from "next/link"

const DEPARTMENTS = ["Pension", "Food", "Health"]

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register, isAuthenticated, hydrated } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/mode-select")
    }
  }, [hydrated, isAuthenticated, router])

  const validations = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Passwords match", valid: password.length > 0 && password === confirmPassword },
  ]

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name.trim() || !department || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    const result = await register({ name: name.trim(), department, email: email.trim(), password })
    setLoading(false)

    if (result.ok) {
      router.push("/mode-select")
    } else {
      setError(result.error || "Registration failed")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Shield className="size-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">JAN-DHANRAKSHA</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create your officer account</p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Registration</CardTitle>
            <CardDescription>Register for system access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Rajesh Kumar" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="department">Department / Organization</Label>
                <select
                  id="department"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                >
                  {DEPARTMENTS.map(dep => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="officer@gov.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                {validations.map(v => (
                  <div key={v.label} className="flex items-center gap-2 text-xs">
                    {v.valid ? <Check className="size-3.5 text-success" /> : <X className="size-3.5 text-muted-foreground/40" />}
                    <span className={v.valid ? "text-success" : "text-muted-foreground"}>{v.label}</span>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/" className="font-medium text-primary hover:underline">Sign In</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
