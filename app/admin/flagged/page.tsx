"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2Icon, CheckCircleIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const MOCK_FLAGGED = [
  { id: "f1", name: "Mystery Savings Pool", reason: "Overpaid — Collected ₦500,000 / Target ₦400,000", type: "overpaid", severity: "high", ts: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "f2", name: "Port Harcourt Alumni 2023", reason: "Stale — No payment activity in 14 days", type: "stale", severity: "medium", ts: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "f3", name: "Lagos NYSC 2026 Batch B", reason: "Failed Webhook — Unresolved for 2 hours", type: "webhook", severity: "high", ts: new Date(Date.now() - 2 * 3600000).toISOString() },
]

export default function AdminFlaggedPage() {
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState(MOCK_FLAGGED)
  const [resolving, setResolving] = React.useState<string | null>(null)

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t) }, [])

  async function resolve(id: string) {
    setResolving(id)
    await new Promise(r => setTimeout(r, 1000))
    setItems(list => list.filter(i => i.id !== id))
    setResolving(null)
    toast.success("Item marked as resolved")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Flagged Items</h1>
        <p className="text-xs text-muted-foreground">Action required for the following items</p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col gap-3 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <CheckCircleIcon className="size-8 text-primary" />
              <p className="font-medium text-foreground">All clear</p>
              <p className="text-xs">No flagged items need attention right now.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/50">
              {items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{item.name}</span>
                      <Badge variant="outline" className={item.severity === "high" ? "border-red-500/30 text-red-400 bg-red-500/10" : "border-amber-500/30 text-amber-400 bg-amber-500/10"}>
                        {item.severity}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">{item.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">Flagged: {new Date(item.ts).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => resolve(item.id)} disabled={resolving === item.id} className="w-full sm:w-auto text-xs h-8">
                    {resolving === item.id ? <Loader2Icon className="size-3.5 animate-spin mr-1.5" /> : <CheckCircleIcon className="size-3.5 mr-1.5" />} Resolve
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
