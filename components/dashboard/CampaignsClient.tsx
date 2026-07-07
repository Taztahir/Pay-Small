"use client"

import * as React from "react"
import Link from "next/link"
import {
  SearchIcon, DownloadIcon, Loader2Icon, LayersIcon,
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
import { campaignsApi } from "@/lib/campaigns"
import type { Campaign } from "@/lib/types"
import { cn } from "@/lib/utils"

function fmt(n: number) { return `₦${n.toLocaleString("en-NG")}` }

function getDeadline(s: string): { label: string; urgent: boolean } {
  const diff = Math.ceil((new Date(s).getTime() - Date.now()) / 86400000)
  if (diff < 0)   return { label: `Expired ${Math.abs(diff)}d ago`, urgent: false }
  if (diff === 0) return { label: "Due today", urgent: true }
  if (diff <= 7)  return { label: `${diff} day${diff === 1 ? "" : "s"} remaining`, urgent: true }
  return { label: `Deadline: ${new Date(s).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}`, urgent: false }
}

function downloadCSV(c: Campaign) {
  const csv = ["Title,Status,Target,Balance,Deadline",
    `${c.title},${c.status},${c.targetAmount ?? ""},${c.currentBalance},${c.deadline}`].join("\n")
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
    download: `${c.title.replace(/\s+/g, "_")}.csv`,
  })
  a.click()
}

const DISPATCH_STYLE: Record<Campaign["dispatchMethod"], { label: string; cls: string }> = {
  email_only: { label: "Email only", cls: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  email_and_sms: { label: "Email + SMS", cls: "border-primary/30 bg-primary/10 text-primary" },
}
const STATUS_DOT: Record<Campaign["status"], string> = {
  draft: "bg-zinc-400",
  active: "bg-primary",
  closed: "bg-blue-400",
}
const STATUS_LABEL: Record<Campaign["status"], string> = {
  draft: "Draft",
  active: "Active",
  closed: "Closed",
}

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
  const target = Number(c.targetAmount ?? 0)
  const collected = Number(c.currentBalance ?? 0)
  const pct = target > 0 ? Math.min(Math.round((collected / target) * 100), 100) : 0
  const dl = getDeadline(c.deadline)
  const type = DISPATCH_STYLE[c.dispatchMethod]

  return (
    <Card className="border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">{c.title}</h2>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[c.status])} />{STATUS_LABEL[c.status]}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Badge variant="outline" className={cn("w-fit text-xs", type.cls)}>{type.label}</Badge>
          <div className="rounded-md border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
            Collection method: {c.dispatchMethod === "email_and_sms" ? "Email + SMS" : "Email only"}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
            aria-label={`${pct}% collected`} className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--primary) 0%,oklch(0.72 0.16 164) 100%)" }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{fmt(collected)} of {fmt(target)}</span>
            <span className="text-xs font-semibold text-primary">{pct}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Balance: {fmt(collected)}</span>
          <span className={cn("font-medium", dl.urgent && "text-amber-400")}>{dl.label}</span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
            <Link href={`/dashboard/campaigns/${c.id}`}>View Details</Link>
          </Button>
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
  { key: "all", label: "All", dot: null as string | null },
  { key: "active", label: "Active", dot: "bg-primary" },
  { key: "closed", label: "Closed", dot: "bg-blue-400" },
  { key: "draft", label: "Draft", dot: "bg-zinc-400" },
] as const
type FilterKey = typeof TABS[number]["key"]

export function CampaignsClient() {
  const [loading, setLoading] = React.useState(true)
  const [filter,  setFilter]  = React.useState<FilterKey>("all")
  const [search,  setSearch]  = React.useState("")
  const [sort,    setSort]    = React.useState("newest")
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([])
  const [error, setError] = React.useState<string | null>(null)

  const loadCampaigns = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await campaignsApi.list()
      setCampaigns(Array.isArray(res?.data) ? res.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load campaigns.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadCampaigns()
  }, [loadCampaigns])

  const counts = React.useMemo(() => ({
    all: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    closed: campaigns.filter((c) => c.status === "closed").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
  }), [campaigns])

  const list = React.useMemo(() => {
    let out = campaigns
    if (filter !== "all") {
      out = out.filter((c) => c.status === filter)
    }
    if (search.trim()) out = out.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    return [...out].sort((a, b) => {
      if (sort === "oldest") return a.id.localeCompare(b.id)
      if (sort === "highest") {
        const aAmount = Number(a.currentBalance ?? 0)
        const bAmount = Number(b.currentBalance ?? 0)
        return bAmount - aAmount
      }
      if (sort === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      return b.id.localeCompare(a.id)
    })
  }, [campaigns, filter, search, sort])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
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

        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

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
            <CreateCampaignModal onCreated={loadCampaigns} />
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
