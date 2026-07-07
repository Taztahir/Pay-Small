"use client"

import * as React from "react"
import { SearchIcon, AlertCircleIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminCampaignsPage() {
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(t)
  }, [])

  const filtered = []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Campaigns</h1>
        <p className="text-xs text-muted-foreground">Live campaign data is not available from the current API contract</p>
      </div>

      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search campaigns or organisers…" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-card pl-9" />
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col gap-3 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
              <AlertCircleIcon className="size-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">No campaign list endpoint is available yet</p>
                <p className="mt-1 text-xs text-muted-foreground">The current backend contract only exposes campaign create/get/update/delete/member operations, not an admin campaign index.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
