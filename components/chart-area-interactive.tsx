"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

// Weekly collections data — amount collected per week of June 2026
const weeklyData = [
  { week: "Week 1 (Jun 1–7)",   collected: 128000 },
  { week: "Week 2 (Jun 8–14)",  collected: 214000 },
  { week: "Week 3 (Jun 15–21)", collected: 175000 },
  { week: "Week 4 (Jun 22–30)", collected: 163000 },
]

// Monthly collections — last 6 months
const monthlyData = [
  { week: "Jan", collected: 420000 },
  { week: "Feb", collected: 380000 },
  { week: "Mar", collected: 510000 },
  { week: "Apr", collected: 460000 },
  { week: "May", collected: 595000 },
  { week: "Jun", collected: 680000 },
]

const chartConfig = {
  collected: {
    label: "Collected",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [view, setView] = React.useState<"weekly" | "monthly">(
    isMobile ? "weekly" : "monthly"
  )

  React.useEffect(() => {
    if (isMobile) setView("weekly")
  }, [isMobile])

  const data = view === "weekly" ? weeklyData : monthlyData
  const total = data.reduce((sum, d) => sum + d.collected, 0)

  return (
    <Card className="@container/card border-border bg-card">
      <CardHeader>
        <div>
          <CardTitle>Collections This Month</CardTitle>
          <CardDescription className="mt-0.5">
            {view === "weekly"
              ? `Total: ${formatNaira(total)} — June 2026`
              : `Total: ${formatNaira(total)} — Last 6 months`}
          </CardDescription>
        </div>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={view ? [view] : []}
            onValueChange={(val) => {
              if (val[0]) setView(val[0] as "weekly" | "monthly")
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[500px]/card:flex"
          >
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={view}
            onValueChange={(val) => setView(val as "weekly" | "monthly")}
          >
            <SelectTrigger
              className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[500px]/card:hidden"
              size="sm"
              aria-label="Select view"
            >
              <SelectValue placeholder="Weekly" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="weekly" className="rounded-lg">Weekly</SelectItem>
              <SelectItem value="monthly" className="rounded-lg">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
          <BarChart data={data} margin={{ left: 0, right: 8 }}>
            <defs>
              <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--primary)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: string) =>
                view === "weekly" ? v.split(" ")[0] + " " + v.split(" ")[1] : v
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) =>
                v >= 1000 ? `₦${v / 1000}k` : `₦${v}`
              }
              width={52}
            />
            <ChartTooltip
              cursor={{ fill: "var(--border)", opacity: 0.5 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => [formatNaira(value as number), "Collected"]}
                />
              }
            />
            <Bar
              dataKey="collected"
              fill="url(#barGreen)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
