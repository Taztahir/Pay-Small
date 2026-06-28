"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2Icon, RefreshCwIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function fmt(n: number) { return `₦${n.toLocaleString("en-NG")}` }
function rel(iso: string) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const STATS = {
  totalUsers: 312, activeCampaigns: 18,
  platformVolume: 1795000, webhookFailures24h: 3,
}

const WEBHOOK_FAILURES = [
  { id: "wh1", campaign: "Lagos NYSC 2026 Batch B", reason: "signature_mismatch", ts: new Date(Date.now() - 2 * 60000).toISOString(), status: "unresolved" },
  { id: "wh2", campaign: "St. Michael's Building Fund", reason: "no_matching_member", ts: new Date(Date.now() - 18 * 60000).toISOString(), status: "unresolved" },
  { id: "wh3", campaign: "Adeyemi Family Ajo", reason: "timeout", ts: new Date(Date.now() - 55 * 60000).toISOString(), status: "retried" },
]

const SMS_STATS = { sent: 47, delivered: 43, failed: 4, senderApproved: true }

const FLAGGED = [
  { id: "f1", name: "Mystery Savings Pool", reason: "Collected exceeds target", severity: "high" as const },
  { id: "f2", name: "Port Harcourt Alumni 2023", reason: "No activity in 14 days", severity: "medium" as const },
]

const RECENT_USERS = [
  { id: "u1", name: "Chukwuemeka Obi",    email: "emeka@example.com",  ts: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: "u2", name: "Fatima Al-Hassan",   email: "fatima@example.com", ts: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: "u3", name: "Tunde Adebayo",      email: "tunde@example.com",  ts: new Date(Date.now() - 3600000).toISOString() },
  { id: "u4", name: "Ngozi Eze",          email: "ngozi@example.com",  ts: new Date(Date.now() - 7200000).toISOString() },
  { id: "u5", name: "Musa Garba",         email: "musa@example.com",   ts: new Date(Date.now() - 86400000).toISOString() },
]

const SEVERITY_STYLE = {
  high:   "border-red-500/30 bg-red-500/10 text-red-400",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  low:    "border-blue-500/30 bg-blue-500/10 text-blue-400",
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, alert }: { label: string; value: string; sub?: string; alert?: boolean }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-bold tabular-nums ${alert ? "text-red-400" : "text-foreground"}`}>{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ── Section heading ────────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold text-foreground">{children}</h2>
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const [loading, setLoading] = React.useState(true)
  const [retrying, setRetrying] = React.useState<string | null>(null)
  const [failures, setFailures] = React.useState(WEBHOOK_FAILURES)

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t) }, [])

  async function retry(id: string) {
    setRetrying(id)
    await new Promise(r => setTimeout(r, 1400))
    setFailures(f => f.map(w => w.id === id ? { ...w, status: "retried" } : w))
    setRetrying(null)
    toast.success("Webhook retry queued")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Overview</h1>
        <p className="text-xs text-muted-foreground">Platform health at a glance</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard label="Total Users" value={STATS.totalUsers.toLocaleString()} sub="All time" />
          <StatCard label="Active Campaigns" value={STATS.activeCampaigns.toString()} sub="Status: active" />
          <StatCard label="Platform Volume" value={fmt(STATS.platformVolume)} sub="All campaigns, all time" />
          <StatCard label="Webhook Failures (24h)" value={STATS.webhookFailures24h.toString()} sub="Unresolved" alert={STATS.webhookFailures24h > 0} />
        </div>
      )}

      {/* Failed webhooks */}
      <section aria-labelledby="webhooks-heading">
        <SectionHeading><span id="webhooks-heading">Failed Nomba Webhooks — Last 24h</span></SectionHeading>
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : (
              <table className="w-full text-xs" role="table">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Campaign</th>
                    <th className="px-4 py-3 font-medium">Reason</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {failures.map(w => (
                    <tr key={w.id} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{w.campaign}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{w.reason}</td>
                      <td className="px-4 py-3 text-muted-foreground">{rel(w.ts)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={
                          w.status === "unresolved" ? "border-red-500/30 bg-red-500/10 text-red-400" :
                          w.status === "retried"    ? "border-amber-500/30 bg-amber-500/10 text-amber-400" :
                          "border-primary/30 bg-primary/10 text-primary"
                        }>{w.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {w.status === "unresolved" && (
                          <Button size="sm" variant="outline" onClick={() => retry(w.id)} disabled={retrying === w.id}
                            className="h-7 gap-1.5 text-xs">
                            {retrying === w.id ? <Loader2Icon className="size-3 animate-spin" /> : <RefreshCwIcon className="size-3" />}
                            Retry
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Two-column panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SMS stats */}
        <section aria-labelledby="sms-heading">
          <SectionHeading><span id="sms-heading">SMS Delivery (Termii) — Today</span></SectionHeading>
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col gap-3 p-5">
              {loading ? <Skeleton className="h-24 w-full" /> : (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-0.5 text-center">
                      <p className="text-xl font-bold text-foreground">{SMS_STATS.sent}</p>
                      <p className="text-[11px] text-muted-foreground">Sent</p>
                    </div>
                    <div className="flex flex-col gap-0.5 text-center">
                      <p className="text-xl font-bold text-primary">{SMS_STATS.delivered}</p>
                      <p className="text-[11px] text-muted-foreground">Delivered</p>
                    </div>
                    <div className="flex flex-col gap-0.5 text-center">
                      <p className="text-xl font-bold text-red-400">{SMS_STATS.failed}</p>
                      <p className="text-[11px] text-muted-foreground">Failed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-2">
                    {SMS_STATS.senderApproved
                      ? <CheckCircleIcon className="size-3.5 text-primary" />
                      : <ClockIcon className="size-3.5 text-amber-400" />}
                    <span className="text-xs text-muted-foreground">
                      Sender ID "PaySmall" —&nbsp;
                      <span className={SMS_STATS.senderApproved ? "text-primary" : "text-amber-400"}>
                        {SMS_STATS.senderApproved ? "Approved" : "Pending approval"}
                      </span>
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Flagged campaigns */}
        <section aria-labelledby="flagged-heading">
          <SectionHeading><span id="flagged-heading">Flagged Campaigns</span></SectionHeading>
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col gap-2 p-5">
              {loading ? <Skeleton className="h-24 w-full" /> : FLAGGED.map(f => (
                <div key={f.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-foreground">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">{f.reason}</p>
                  </div>
                  <Badge variant="outline" className={SEVERITY_STYLE[f.severity]}>{f.severity}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Recent signups */}
      <section aria-labelledby="signups-heading">
        <SectionHeading><span id="signups-heading">Recent Signups</span></SectionHeading>
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <table className="w-full text-xs" role="table">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Signed up</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map(u => (
                  <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{rel(u.ts)}</td>
                    <td className="px-4 py-3">
                      <a href={`/admin/users/${u.id}`} className="text-primary hover:underline">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
