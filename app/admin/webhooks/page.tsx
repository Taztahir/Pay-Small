"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2Icon, RefreshCwIcon, CodeIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function fmt(n: number) { return `₦${n.toLocaleString("en-NG")}` }

const MOCK_WEBHOOKS = [
  { id: "w1", ts: new Date(Date.now() - 2 * 60000).toISOString(), campaign: "Chioma & Emeka Wedding", account: "0123456789", amount: 5000, status: "failed", reason: "signature_mismatch", payload: { event: "transfer", amount: 5000, signature: "invalid_sig" } },
  { id: "w2", ts: new Date(Date.now() - 15 * 60000).toISOString(), campaign: "Adeyemi Family Ajo", account: "0456789123", amount: 10000, status: "success", reason: null, payload: { event: "transfer", amount: 10000, signature: "valid_sig" } },
  { id: "w3", ts: new Date(Date.now() - 45 * 60000).toISOString(), campaign: "St. Michael's Building", account: "0234567891", amount: 50000, status: "success", reason: null, payload: { event: "transfer", amount: 50000, signature: "valid_sig" } },
  { id: "w4", ts: new Date(Date.now() - 120 * 60000).toISOString(), campaign: "Mama Bello Burial", account: "0987654321", amount: 2000, status: "failed", reason: "timeout", payload: { event: "transfer", amount: 2000, signature: "valid_sig" } },
]

function WebhookRow({ w }: { w: typeof MOCK_WEBHOOKS[0] }) {
  const [expanded, setExpanded] = React.useState(false)
  const [retrying, setRetrying] = React.useState(false)

  async function retry() {
    setRetrying(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success("Webhook retried")
    setRetrying(false)
  }

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-muted/20">
        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(w.ts).toLocaleString("en-NG", { hour12: false })}</td>
        <td className="px-4 py-3 font-medium text-foreground">{w.campaign}</td>
        <td className="px-4 py-3 font-mono text-muted-foreground">{w.account}</td>
        <td className="px-4 py-3 tabular-nums text-foreground">{fmt(w.amount)}</td>
        <td className="px-4 py-3">
          <Badge variant="outline" className={w.status === "success" ? "border-primary/30 text-primary" : "border-red-500/30 text-red-400"}>
            {w.status}
          </Badge>
          {w.reason && <p className="text-[10px] text-red-400 mt-1">{w.reason}</p>}
        </td>
        <td className="px-4 py-3 flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)} className="h-7 px-2">
            <CodeIcon className="size-3.5 mr-1" /> {expanded ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
          </Button>
          {w.status === "failed" && (
            <Button size="sm" variant="outline" onClick={retry} disabled={retrying} className="h-7 text-xs">
              {retrying ? <Loader2Icon className="size-3 animate-spin" /> : <RefreshCwIcon className="size-3 mr-1" />} Retry
            </Button>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border/50 bg-muted/10">
          <td colSpan={6} className="p-4">
            <pre className="text-[10px] text-muted-foreground font-mono bg-background p-3 rounded-md overflow-x-auto border border-border">
              {JSON.stringify(w.payload, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminWebhooksPage() {
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState("all")

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t) }, [])

  const filtered = MOCK_WEBHOOKS.filter(w => filter === "all" || w.status === filter)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Webhooks & Payments</h1>
        <p className="text-xs text-muted-foreground">Raw Nomba webhook logs</p>
      </div>

      <div className="flex">
        <Select value={filter} onValueChange={(value) => setFilter(value ?? "") }>
          <SelectTrigger className="w-40 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Webhooks</SelectItem>
            <SelectItem value="success">Success Only</SelectItem>
            <SelectItem value="failed">Failed Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col gap-3 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs" role="table">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Timestamp</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Campaign</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Account</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Amount</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(w => <WebhookRow key={w.id} w={w} />)}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
