import * as React from "react"
import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NotificationsClient } from "@/components/dashboard/NotificationsClient"

export const metadata: Metadata = {
  title: "Notifications — PaySmall",
  description: "Manage your email and SMS notification settings.",
}

export default function NotificationsPage() {
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
        <NotificationsClient />
      </SidebarInset>
    </SidebarProvider>
  )
}
