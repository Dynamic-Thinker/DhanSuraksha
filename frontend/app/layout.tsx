import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AppProvider } from "@/lib/app-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "JAN-DHANRAKSHA | National Welfare Integrity Engine",
  description:
    "Government welfare protection system for fraud prevention, duplicate claims detection, and ledger integrity monitoring.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1f2e" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
        <Analytics />
      </body>
    </html>
  )
}
