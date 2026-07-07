"use client"

import * as React from "react"
import { BellIcon } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function NotificationsClient() {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div>
          <h1 className="text-sm font-semibold text-foreground">Notifications</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Stay updated with your group activities, payments, and system events.
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BellIcon className="size-6 text-muted-foreground" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Notifications are not available yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The current backend contract does not expose a notifications endpoint, so this screen is waiting for the real API.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
