"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LayersIcon, TrendingUpIcon, UsersIcon, ClockIcon } from "lucide-react"

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

import type { Campaign } from "@/lib/types"

export function SectionCards({ campaigns }: { campaigns: Campaign[] }) {
  const totalCampaigns = campaigns.length
  const totalCollected = campaigns.reduce((sum, c) => sum + Number(c.currentBalance || 0), 0)
  const activeCampaigns = campaigns.filter(c => c.status === "active").length
  const totalTarget = campaigns.reduce((sum, c) => sum + Number(c.targetAmount || 0), 0)

  const stats = [
    {
      label: "Total Campaigns",
      value: String(totalCampaigns),
      icon: LayersIcon,
      badge: `${activeCampaigns} active`,
      trend: "up",
      note: "Across all campaign statuses",
    },
    {
      label: "Total Collected",
      value: formatNaira(totalCollected),
      icon: TrendingUpIcon,
      badge: totalTarget > 0 ? `${Math.round((totalCollected / totalTarget) * 100)}% of target` : "0% of target",
      trend: "up",
      note: "Contributions received",
    },
    {
      label: "Active Campaigns",
      value: String(activeCampaigns),
      icon: UsersIcon,
      badge: "In progress",
      trend: "up",
      note: "Accepting payments",
    },
    {
      label: "Total Target",
      value: formatNaira(totalTarget),
      icon: ClockIcon,
      badge: "Target goal",
      trend: "up",
      note: "Sum of target goals",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, badge, trend, note }) => (
        <Card
          key={label}
          className="@container/card border-border bg-card"
        >
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="size-3.5" />
              {label}
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
              {value}
            </CardTitle>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  trend === "warn"
                    ? "border-[oklch(0.75_0.152_72)/30%] text-[oklch(0.75_0.152_72)]"
                    : "border-primary/30 text-primary"
                }
              >
                {badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {note}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
