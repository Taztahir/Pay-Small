"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboardIcon, LayersIcon, SettingsIcon, LogOutIcon, PiggyBankIcon, BellIcon } from "lucide-react"
import { authApi } from "@/lib/auth"
import { useUser } from "@/components/user-context"
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

const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Campaigns",  href: "/dashboard/campaigns", icon: LayersIcon },
  { title: "Notifications", href: "/dashboard/notifications", icon: BellIcon },
  { title: "Settings",  href: "/dashboard/settings",  icon: SettingsIcon },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const { user } = useUser()
  const sidebarUser = {
    name: user?.name || "Your account",
    email: user?.email || "",
    avatar: "",
  }

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await authApi.logout()
      } catch (error) {
        console.error("Logout failed:", error)
      } finally {
        router.push("/sign-in")
        router.refresh()
      }
    })
  }

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
            <SidebarMenuButton
              tooltip="Log out"
              render={<button type="button" />}
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOutIcon className="size-4" />
              <span>{isPending ? "Logging out..." : "Log out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
