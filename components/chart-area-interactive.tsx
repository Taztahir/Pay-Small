"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Campaign } from "@/lib/types"

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

const chartConfig = {
  collected: {
    label: "Collected",
    color: "var(--primary)",
  },
  target: {
    label: "Target",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ campaigns }: { campaigns: Campaign[] }) {
  const totalCollected = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.currentBalance ?? 0),
    0
  )
  const totalTarget = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.targetAmount ?? 0),
    0
  )

  const data = [
    { label: "Collected", collected: totalCollected, target: 0 },
    { label: "Target", collected: 0, target: totalTarget },
  ]

  return (
    <Card className="@container/card border-border bg-card">
      <CardHeader>
        <div>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription className="mt-0.5">
            {campaigns.length > 0
              ? `Collected ${formatNaira(totalCollected)} across ${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"}`
              : "Create a campaign to start tracking progress"}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
          <BarChart data={data} margin={{ left: 0, right: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `₦${value / 1000}k` : `₦${value}`
              }
              width={52}
            />
            <ChartTooltip
              cursor={{ fill: "var(--border)", opacity: 0.5 }}
              content={
                <ChartTooltipContent formatter={(value) => [formatNaira(value as number), "Amount"]} />
              }
            />
            <Bar dataKey="collected" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" fill="var(--muted-foreground)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
