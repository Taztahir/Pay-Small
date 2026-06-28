"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, LayersIcon, SettingsIcon, LogOutIcon, PiggyBankIcon, BellIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const user = {
  name: "Amara Okafor",
  email: "amara@paysmall.ng",
  avatar: "",
}

const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Campaigns",  href: "/dashboard/campaigns", icon: LayersIcon },
  { title: "Notifications", href: "/dashboard/notifications", icon: BellIcon },
  { title: "Settings",  href: "/dashboard/settings",  icon: SettingsIcon },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* ── Logo ─────────────────────────────────────────── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! h-12"
              render={<Link href="/" />}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <PiggyBankIcon className="size-4 text-primary-foreground" />
              </span>
              <span className="text-base font-bold tracking-tight text-foreground">
                Pay<span className="text-primary">Small</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Main nav ─────────────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(({ title, href, icon: Icon }) => {
                const active = pathname === href
                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={title}
                      render={<Link href={href} />}
                    >
                      <Icon className="size-4" />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: user + logout ────────────────────────── */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log out" render={<button type="button" />}>
              <LogOutIcon className="size-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
