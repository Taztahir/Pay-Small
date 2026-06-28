"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  SearchIcon, CopyIcon, DownloadIcon, BellIcon, Loader2Icon, LayersIcon,
} from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCampaignModal } from "@/components/dashboard/CreateCampaignModal"
import { cn } from "@/lib/utils"

type CampaignStatus = "active" | "completed" | "expired"
type CampaignType = "ajo" | "aso-ebi" | "burial" | "church" | "nysc" | "family" | "other"

interface Campaign {
  id: string; name: string; type: CampaignType; status: CampaignStatus
  collected: number; target: number; bank: string; accountNumber: string
  totalMembers: number; paidMembers: number; deadline: string
}

const CAMPAIGNS: Campaign[] = [
  { id: "1", name: "Aso Ebi — Chioma & Emeka Wedding", type: "aso-ebi", status: "active",
    collected: 270000, target: 420000, bank: "GTB", accountNumber: "0123456789", totalMembers: 28, paidMembers: 18, deadline: "2026-07-20" },
  { id: "2", name: "Mama Bello Burial Committee", type: "burial", status: "completed",
    collected: 375000, target: 375000, bank: "Access Bank", accountNumber: "0987654321", totalMembers: 15, paidMembers: 15, deadline: "2026-06-05" },
  { id: "3", name: "Adeyemi Family Monthly Ajo", type: "ajo", status: "active",
    collected: 35000, target: 60000, bank: "First Bank", accountNumber: "0456789123", totalMembers: 12, paidMembers: 7, deadline: "2026-06-30" },
  { id: "4", name: "Lagos NYSC 2026 Batch B Welfare", type: "nysc", status: "active",
    collected: 180000, target: 300000, bank: "Zenith Bank", accountNumber: "0345678912", totalMembers: 20, paidMembers: 12, deadline: "2026-08-01" },
  { id: "5", name: "St. Michael's Building Fund", type: "church", status: "active",
    collected: 890000, target: 2000000, bank: "UBA", accountNumber: "0234567891", totalMembers: 45, paidMembers: 30, deadline: "2026-09-15" },
  { id: "6", name: "Okafor Family Reunion 2026", type: "family", status: "expired",
    collected: 45000, target: 150000, bank: "GTB", accountNumber: "0567891234", totalMembers: 10, paidMembers: 3, deadline: "2026-05-01" },
]

function fmt(n: number) { return `₦${n.toLocaleString("en-NG")}` }

function getDeadline(s: string): { label: string; urgent: boolean } {
  const diff = Math.ceil((new Date(s).getTime() - Date.now()) / 86400000)
  if (diff < 0)   return { label: `Expired ${Math.abs(diff)}d ago`, urgent: false }
  if (diff === 0) return { label: "Due today", urgent: true }
  if (diff <= 7)  return { label: `${diff} day${diff === 1 ? "" : "s"} remaining`, urgent: true }
  return { label: `Deadline: ${new Date(s).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}`, urgent: false }
}

function downloadCSV(c: Campaign) {
  const csv = ["Name,Type,Status,Collected,Target,Paid,Total,Deadline",
    `${c.name},${c.type},${c.status},${c.collected},${c.target},${c.paidMembers},${c.totalMembers},${c.deadline}`].join("\n")
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: `${c.name.replace(/\s+/g, "_")}.csv`,
  })
  a.click()
}

const TYPE_STYLE: Record<CampaignType, { label: string; cls: string }> = {
  "ajo":     { label: "Ajo",     cls: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  "aso-ebi": { label: "Aso Ebi", cls: "border-purple-500/30 bg-purple-500/10 text-purple-400" },
  "burial":  { label: "Burial",  cls: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400" },
  "church":  { label: "Church",  cls: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400" },
  "nysc":    { label: "NYSC",    cls: "border-orange-500/30 bg-orange-500/10 text-orange-400" },
  "family":  { label: "Family",  cls: "border-pink-500/30 bg-pink-500/10 text-pink-400" },
  "other":   { label: "Other",   cls: "border-primary/30 bg-primary/10 text-primary" },
}
const STATUS_DOT:   Record<CampaignStatus, string> = { active: "bg-primary", completed: "bg-blue-400", expired: "bg-red-400" }
const STATUS_LABEL: Record<CampaignStatus, string> = { active: "Active", completed: "Completed", expired: "Expired" }

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex justify-between gap-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-5 w-16 rounded-full" /></div>
      <div className="flex gap-2"><Skeleton className="h-4 w-16 rounded-full" /><Skeleton className="h-4 w-32" /></div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between"><Skeleton className="h-3 w-28" /><Skeleton className="h-3 w-8" /></div>
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 flex-1 rounded-md" /><Skeleton className="h-8 flex-1 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  )
}

function CampaignCard({ c }: { c: Campaign }) {
  const [reminding, setReminding] = React.useState(false)
  const pct     = Math.min(Math.round((c.collected / c.target) * 100), 100)
  const pending = c.totalMembers - c.paidMembers
  const dl      = getDeadline(c.deadline)
  const type    = TYPE_STYLE[c.type]

  async function copy() {
    await navigator.clipboard.writeText(c.accountNumber)
    toast.success("Copied!", { description: `${c.accountNumber} copied to clipboard` })
  }
  async function remind() {
    setReminding(true)
    await new Promise(r => setTimeout(r, 1500))
    setReminding(false)
    toast.success(`Reminders sent to ${pending} member${pending === 1 ? "" : "s"}`)
  }

  return (
    <Card className="border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">{c.name}</h2>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[c.status])} />{STATUS_LABEL[c.status]}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Badge variant="outline" className={cn("w-fit text-xs", type.cls)}>{type.label}</Badge>
          <div className="flex items-center justify-between rounded-md border border-border bg-background/50 px-3 py-1.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted-foreground shrink-0">{c.bank}</span>
              <span className="font-mono text-xs font-medium tracking-wider truncate">{c.accountNumber}</span>
            </div>
            <button type="button" onClick={copy} aria-label="Copy account number"
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
              <CopyIcon className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
            aria-label={`${pct}% collected`} className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--primary) 0%,oklch(0.72 0.16 164) 100%)" }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{fmt(c.collected)} of {fmt(c.target)}</span>
            <span className="text-xs font-semibold text-primary">{pct}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{c.paidMembers} of {c.totalMembers} members paid</span>
          <span className={cn("font-medium", dl.urgent && "text-amber-400")}>{dl.label}</span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
            <Link href={`/dashboard/campaigns/${c.id}`}>View Details</Link>
          </Button>
          {c.status === "active" && pending > 0 && (
            <Button size="sm" variant="ghost" onClick={remind} disabled={reminding}
              className="flex-1 gap-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs">
              {reminding
                ? <><Loader2Icon className="size-3 animate-spin" />Sending…</>
                : <><BellIcon className="size-3" />Remind</>}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => downloadCSV(c)} aria-label="Download CSV report"
            className="shrink-0 px-2.5 text-muted-foreground hover:text-foreground">
            <DownloadIcon className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const TABS = [
  { key: "all",       label: "All",       dot: null as string | null },
  { key: "active",    label: "Active",    dot: "bg-primary" },
  { key: "completed", label: "Completed", dot: "bg-blue-400" },
  { key: "expired",   label: "Expired",   dot: "bg-red-400" },
] as const
type FilterKey = typeof TABS[number]["key"]

export function CampaignsClient() {
  const [loading, setLoading] = React.useState(true)
  const [filter,  setFilter]  = React.useState<FilterKey>("all")
  const [search,  setSearch]  = React.useState("")
  const [sort,    setSort]    = React.useState("newest")

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t) }, [])

  const counts = React.useMemo(() => ({
    all: CAMPAIGNS.length,
    active:    CAMPAIGNS.filter(c => c.status === "active").length,
    completed: CAMPAIGNS.filter(c => c.status === "completed").length,
    expired:   CAMPAIGNS.filter(c => c.status === "expired").length,
  }), [])

  const list = React.useMemo(() => {
    let out = CAMPAIGNS
    if (filter !== "all") out = out.filter(c => c.status === filter)
    if (search.trim())    out = out.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    return [...out].sort((a, b) => {
      if (sort === "oldest")   return a.id.localeCompare(b.id)
      if (sort === "highest")  return b.collected - a.collected
      if (sort === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      return b.id.localeCompare(a.id)
    })
  }, [filter, search, sort])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Campaigns</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Manage all your contribution campaigns</p>
          </div>
          <CreateCampaignModal />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-5 px-4 py-6 lg:px-6">
        {/* Filter tabs */}
        <div role="tablist" aria-label="Filter by status" className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {TABS.map(tab => (
            <button key={tab.key} role="tab" aria-selected={filter === tab.key} onClick={() => setFilter(tab.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                filter === tab.key
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}>
              {tab.dot && <span className={cn("h-1.5 w-1.5 rounded-full", tab.dot)} />}
              {tab.label}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                filter === tab.key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input id="campaigns-search" placeholder="Search campaigns…" value={search}
              onChange={e => setSearch(e.target.value)} className="bg-background pl-9" aria-label="Search campaigns" />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full bg-background sm:w-48" aria-label="Sort campaigns"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="highest">Highest collected</SelectItem>
              <SelectItem value="deadline">Deadline soonest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid / empty / loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : list.length === 0 && !search.trim() ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
              <LayersIcon className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No campaigns yet</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">Create your first campaign to start tracking contributions</p>
            </div>
            <CreateCampaignModal />
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <SearchIcon className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No results for &ldquo;{search}&rdquo;</p>
            <p className="text-xs text-muted-foreground">Try a different search term</p>
            <Button variant="ghost" size="sm" onClick={() => setSearch("")}>Clear search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {list.map(c => <CampaignCard key={c.id} c={c} />)}
          </div>
        )}
      </div>
    </>
  )
}
