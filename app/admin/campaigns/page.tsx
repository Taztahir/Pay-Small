"use client"

import * as React from "react"
import { toast } from "sonner"
import { SearchIcon, MoreHorizontalIcon, Loader2Icon, SnowflakeIcon, ActivityIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function fmt(n: number) { return `₦${n.toLocaleString("en-NG")}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })
}

type CampaignStatus = "active" | "completed" | "expired"
interface AdminCampaign {
  id: string; name: string; orgName: string; orgEmail: string; type: string;
  status: CampaignStatus; collected: number; target: number; account: string;
  created: string; frozen: boolean;
}

const MOCK_CAMPAIGNS: AdminCampaign[] = [
  { id: "c1", name: "Chioma & Emeka Wedding", orgName: "Amara Okafor", orgEmail: "amara@paysmall.ng", type: "aso-ebi", status: "active", collected: 270000, target: 420000, account: "0123456789", created: "2026-06-01", frozen: false },
  { id: "c2", name: "Mama Bello Burial", orgName: "Tunde Adebayo", orgEmail: "tunde@example.com", type: "burial", status: "completed", collected: 375000, target: 375000, account: "0987654321", created: "2026-05-15", frozen: false },
  { id: "c3", name: "Adeyemi Family Ajo", orgName: "Ngozi Eze", orgEmail: "ngozi@example.com", type: "ajo", status: "active", collected: 35000, target: 60000, account: "0456789123", created: "2026-06-10", frozen: true },
  { id: "c4", name: "St. Michael's Building", orgName: "Emeka Nwosu", orgEmail: "enwosu@example.com", type: "church", status: "active", collected: 890000, target: 2000000, account: "0234567891", created: "2026-02-20", frozen: false },
]

export default function AdminCampaignsPage() {
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [campaigns, setCampaigns] = React.useState(MOCK_CAMPAIGNS)
  const [confirmFreeze, setConfirmFreeze] = React.useState<AdminCampaign | null>(null)
  const [acting, setActing] = React.useState(false)

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t) }, [])

  const filtered = React.useMemo(() => {
    return campaigns.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.orgName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === "all" || c.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [campaigns, search, filterStatus])

  async function applyFreeze() {
    if (!confirmFreeze) return
    setActing(true)
    await new Promise(r => setTimeout(r, 1000))
    const isFrozen = confirmFreeze.frozen
    setCampaigns(list => list.map(c => c.id === confirmFreeze.id ? { ...c, frozen: !isFrozen } : c))
    toast.success(`Campaign ${isFrozen ? "unfrozen" : "frozen"}`)
    setActing(false)
    setConfirmFreeze(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Campaigns</h1>
        <p className="text-xs text-muted-foreground">All campaigns across the platform</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search campaigns or organisers…" value={search} onChange={e => setSearch(e.target.value)} className="bg-card pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
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
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Campaign</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Organiser</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Progress</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Account</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Created</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 font-medium whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{c.type}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{c.orgName}</p>
                        <p className="text-[10px] text-muted-foreground">{c.orgEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{fmt(c.collected)}</p>
                        <p className="text-[10px] text-muted-foreground">of {fmt(c.target)}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{c.account}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(c.created)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="outline" className={c.status === "active" ? "border-primary/30 text-primary" : "border-border text-muted-foreground"}>{c.status}</Badge>
                          {c.frozen && <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-[9px]">FROZEN</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><MoreHorizontalIcon className="size-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><ActivityIcon className="size-3.5 mr-1.5" />View History</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setConfirmFreeze(c)}>
                              <SnowflakeIcon className="size-3.5 mr-1.5 text-cyan-400" />
                              {c.frozen ? "Unfreeze Campaign" : "Freeze Campaign"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!confirmFreeze} onOpenChange={o => !o && setConfirmFreeze(null)}>
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Confirm action</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {confirmFreeze?.frozen
                ? `Unfreeze "${confirmFreeze.name}"? Payments will be accepted again.`
                : `Freeze "${confirmFreeze.name}"? This stops all incoming payments.`}
            </p>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmFreeze(null)} disabled={acting}>Cancel</Button>
            <Button onClick={applyFreeze} disabled={acting} className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {acting && <Loader2Icon className="size-3.5 animate-spin" />}
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
