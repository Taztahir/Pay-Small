"use client"

import * as React from "react"
import { Loader2Icon, ShieldCheckIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usersApi } from "@/lib/admin"
import type { CurrentUser } from "@/lib/types"

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default function AdminOverviewPage() {
  const [loading, setLoading] = React.useState(true)
  const [profile, setProfile] = React.useState<CurrentUser | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    usersApi
      .me()
      .then((res) => {
        if (cancelled) return
        setProfile(res.data)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Unable to load your admin profile.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Overview</h1>
        <p className="text-xs text-muted-foreground">Authenticated admin identity and access state</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : error ? (
        <Card className="border-border bg-card">
          <CardContent className="p-5 text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <StatCard label="Signed in as" value={profile?.name ?? "Unknown"} sub={profile?.email ?? "No email available"} />
          <StatCard label="Account ID" value={profile?.id ?? "—"} sub="Current auth session" />
          <StatCard label="Status" value="Authenticated" sub="Token verified via /users/me" />
        </div>
      )}

      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Connected to the live PaySmall API</p>
          </div>
          <p className="text-sm text-muted-foreground">
            The current API contract exposes authenticated profile data through /users/me. Admin list and campaign list endpoints are not available yet, so this screen now shows the real signed-in identity instead of fabricated metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
