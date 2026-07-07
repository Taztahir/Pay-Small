import * as React from "react"
import type { Metadata } from "next"
import { DashboardClient } from "@/components/dashboard/DashboardClient"
import { CreateCampaignModal } from "@/components/dashboard/CreateCampaignModal"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Dashboard — PaySmall",
  description:
    "Manage your contribution campaigns, track collections, and monitor community savings.",
}

export default function DashboardPage() {
  return (
    <>
      {/* ── Top header bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />

        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Overview of your campaigns and collections
            </p>
          </div>

          {/* Create Campaign CTA — modal trigger lives here */}
          <CreateCampaignModal />
        </div>
      </header>

      {/* ── Main content (Client-side fetched) ─────────────── */}
      <DashboardClient />
    </>
  )
}
