"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api"
import { campaignsApi } from "@/lib/campaigns"
import type { Campaign } from "@/lib/types"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { Loader2Icon } from "lucide-react"

export function DashboardClient() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace("/sign-in")
      return
    }

    let cancelled = false

    setLoading(true)
    setError(null)

    campaignsApi
      .list()
      .then((res) => {
        if (cancelled) return
        setCampaigns(Array.isArray(res?.data) ? res.data : [])
      })
      .catch((err) => {
        if (cancelled) return
        console.error("Dashboard fetch campaigns failed:", err)
        setCampaigns([])
        setError(err instanceof Error ? err.message : "Unable to load campaigns right now.")
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-40">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 py-6">
        {error ? (
          <div className="mx-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive lg:mx-6">
            {error}
          </div>
        ) : null}
        <SectionCards campaigns={campaigns} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive campaigns={campaigns} />
        </div>
        <DataTable campaigns={campaigns} />
      </div>
    </div>
  )
}
