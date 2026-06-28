"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  BellIcon,
  CheckCheckIcon,
  CircleIcon,
  CreditCardIcon,
  UserPlusIcon,
  SparklesIcon,
  AlertCircleIcon,
  Trash2Icon,
  ArrowRightIcon,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NotificationItem {
  id: string
  type: "payment" | "system" | "member" | "alert"
  title: string
  description: string
  time: string
  read: boolean
  amount?: string
  campaign?: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "payment",
    title: "Payment Received",
    description: "Tunde Fashola contributed to 'December Travel Fund'",
    amount: "₦50,000",
    campaign: "December Travel Fund",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "notif-2",
    type: "member",
    title: "New Join Request",
    description: "Babajide Alao requested to join the 'Family House Co-op' group",
    campaign: "Family House Co-op",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "system",
    title: "Campaign Target Reached! 🎉",
    description: "The 'Tech Hub Setup' group has successfully pooled 100% of its target.",
    amount: "₦1,200,000",
    campaign: "Tech Hub Setup",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "notif-4",
    type: "alert",
    title: "Upcoming Contribution Due",
    description: "Your monthly contribution to 'Rent Savings' is due by 12:00 PM tomorrow.",
    amount: "₦20,000",
    campaign: "Rent Savings",
    time: "1 day ago",
    read: true,
  },
  {
    id: "notif-5",
    type: "payment",
    title: "Payout Disbursed",
    description: "The rotation payout has been successfully transferred to Chioma Nnadi.",
    amount: "₦350,000",
    campaign: "Friday Ajo Club",
    time: "3 days ago",
    read: true,
  },
]

export function NotificationsClient() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialNotifications)
  const [filter, setFilter] = React.useState<"all" | "unread" | "payment" | "alert">("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read
    if (filter === "payment") return n.type === "payment"
    if (filter === "alert") return n.type === "alert"
    return true
  })

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const toggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success("Notification deleted")
  }

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "payment":
        return <CreditCardIcon className="size-4 text-emerald-500" />
      case "member":
        return <UserPlusIcon className="size-4 text-blue-500" />
      case "system":
        return <SparklesIcon className="size-4 text-amber-500" />
      case "alert":
        return <AlertCircleIcon className="size-4 text-red-500" />
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Notifications</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Stay updated with your group activities, payments, and system events
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-1.5 border-border hover:bg-accent text-xs"
            >
              <CheckCheckIcon className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex flex-col gap-6 px-4 py-6 lg:px-6">
        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="text-xs gap-1.5"
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary text-[10px] px-1 py-0 h-4 min-w-4 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={filter === "payment" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("payment")}
            className="text-xs"
          >
            Payments
          </Button>
          <Button
            variant={filter === "alert" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("alert")}
            className="text-xs"
          >
            Alerts
          </Button>
        </div>

        {/* Notifications list */}
        <div className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-12 text-center bg-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <BellIcon className="size-6 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-0.5">No notifications match your current filter.</p>
              </div>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <Card
                key={notif.id}
                className={cn(
                  "border-border transition-colors hover:bg-muted/30 relative overflow-hidden",
                  notif.read ? "bg-card/45" : "bg-card border-l-2 border-l-primary"
                )}
              >
                <CardContent className="p-4 flex gap-4 items-start">
                  {/* Read / Unread Indicator & Icon */}
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                    {getIcon(notif.type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium text-foreground truncate", !notif.read && "font-semibold")}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{notif.time}</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {notif.description}
                    </p>

                    {/* Meta tags / badges for payments/campaigns */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {notif.amount && (
                        <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-500/5 text-emerald-400 border-emerald-500/20">
                          {notif.amount}
                        </Badge>
                      )}
                      {notif.campaign && (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
                          {notif.campaign}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                      onClick={() => toggleRead(notif.id)}
                      title={notif.read ? "Mark as unread" : "Mark as read"}
                    >
                      <CircleIcon className={cn("size-3.5", notif.read ? "fill-muted-foreground" : "fill-primary text-primary")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={() => deleteNotification(notif.id)}
                      title="Delete"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}
