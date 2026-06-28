"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon, UsersIcon, LayersIcon, WebhookIcon,
  MessageSquareIcon, FlagIcon, PiggyBankIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin",          label: "Overview",           icon: LayoutDashboardIcon },
  { href: "/admin/users",    label: "Users",              icon: UsersIcon },
  { href: "/admin/campaigns",label: "Campaigns",          icon: LayersIcon },
  { href: "/admin/webhooks", label: "Webhooks & Payments",icon: WebhookIcon },
  { href: "/admin/sms-logs", label: "SMS Logs",           icon: MessageSquareIcon },
  { href: "/admin/flagged",  label: "Flagged Items",      icon: FlagIcon },
]

function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <PiggyBankIcon className="size-4 text-primary-foreground" />
        </span>
        <span className="text-sm font-bold tracking-tight text-foreground">
          Pay<span className="text-primary">Small</span>
          <span className="ml-1.5 rounded bg-red-500/20 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-red-400">
            Admin
          </span>
        </span>
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const exact = href === "/admin"
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer note */}
      <div className="border-t border-border p-3">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Internal tooling — do not share access or URLs with users.
        </p>
      </div>
    </aside>
  )
}

export function AdminShell({
  children,
  hasIssues,
}: {
  children: React.ReactNode
  hasIssues: boolean
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Red/amber accent strip — makes it instantly clear this isn't the user dashboard */}
        <div
          className="h-1 w-full shrink-0"
          style={{ background: "linear-gradient(90deg,#ef4444 0%,#f59e0b 50%,#ef4444 100%)" }}
        />

        {/* Top bar */}
        <header className="flex h-13 shrink-0 items-center justify-between border-b border-border bg-background px-6 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">PaySmall Admin</span>
            <span className="text-[11px] text-muted-foreground">
              Internal monitoring — not visible to organisers
            </span>
          </div>

          {/* System status badge */}
          {hasIssues ? (
            <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
              Issues detected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              All systems operational
            </span>
          )}
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
