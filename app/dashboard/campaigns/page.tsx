import * as React from "react"
import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CampaignsClient } from "@/components/dashboard/CampaignsClient"

export const metadata: Metadata = {
  title: "Campaigns — PaySmall",
  description: "Manage all your contribution campaigns, track collections, and send reminders.",
}

export default function CampaignsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <CampaignsClient />
      </SidebarInset>
    </SidebarProvider>
  )
}
