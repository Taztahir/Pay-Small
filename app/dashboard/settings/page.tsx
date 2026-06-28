import * as React from "react"
import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SettingsClient } from "@/components/dashboard/SettingsClient"

export const metadata: Metadata = {
  title: "Settings — PaySmall",
  description: "Manage your account, notification preferences, and API integrations.",
}

export default function SettingsPage() {
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
        <SettingsClient />
      </SidebarInset>
    </SidebarProvider>
  )
}
