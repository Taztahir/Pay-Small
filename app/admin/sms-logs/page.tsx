"use client"

import * as React from "react"
import { SearchIcon, MessageSquareIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const MOCK_SMS = [
  { id: "s1", ts: new Date(Date.now() - 5 * 60000).toISOString(), phone: "0801***5678", campaign: "Chioma & Emeka Wedding", type: "reminder", status: "delivered", msgId: "TM-12345" },
  { id: "s2", ts: new Date(Date.now() - 15 * 60000).toISOString(), phone: "0812***6789", campaign: "Adeyemi Family Ajo", type: "confirmation", status: "delivered", msgId: "TM-12346" },
  { id: "s3", ts: new Date(Date.now() - 60 * 60000).toISOString(), phone: "0701***3344", campaign: "St. Michael's Building", type: "reminder", status: "failed", msgId: "TM-12347" },
  { id: "s4", ts: new Date(Date.now() - 120 * 60000).toISOString(), phone: "0908***4321", campaign: "Mama Bello Burial", type: "confirmation", status: "pending", msgId: "TM-12348" },
]

export default function AdminSmsLogsPage() {
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState("all")

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t) }, [])

  const filtered = MOCK_SMS.filter(s => filter === "all" || s.status === filter)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">SMS Logs</h1>
        <p className="text-xs text-muted-foreground">All messages sent via Termii</p>
      </div>

      <div className="flex">
        <Select value={filter} onValueChange={(value) => setFilter(value ?? "") }>
          <SelectTrigger className="w-40 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
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
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Recipient</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Campaign</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Type</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Termii ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(s.ts).toLocaleString("en-NG", { hour12: false })}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{s.phone}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{s.campaign}</td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{s.type}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={s.status === "delivered" ? "border-primary/30 text-primary" : s.status === "failed" ? "border-red-500/30 text-red-400" : "border-amber-500/30 text-amber-400"}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{s.msgId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
