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

const stats = [
  {
    label: "Total Campaigns",
    value: "24",
    icon: LayersIcon,
    badge: "+3 this month",
    trend: "up",
    note: "Across all campaign types",
  },
  {
    label: "Total Collected",
    value: formatNaira(680000),
    icon: TrendingUpIcon,
    badge: "+18.4%",
    trend: "up",
    note: "Since last month",
  },
  {
    label: "Total Members",
    value: "312",
    icon: UsersIcon,
    badge: "+12.5%",
    trend: "up",
    note: "Across active campaigns",
  },
  {
    label: "Pending Payments",
    value: "47",
    icon: ClockIcon,
    badge: "Needs attention",
    trend: "warn",
    note: "SMS reminders sent",
  },
]

export function SectionCards() {
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
