"use client"

import * as React from "react"
import { toast } from "sonner"
import { SearchIcon, MoreHorizontalIcon, Loader2Icon, ShieldAlertIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

function fmt(n: number) { return `₦${n.toLocaleString("en-NG")}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })
}

interface AdminUser {
  id: string; name: string; email: string; phone: string; signupDate: string
  campaigns: number; totalCollected: number; status: "active" | "suspended"; isAdmin: boolean
}

const MOCK_USERS: AdminUser[] = [
  { id: "u1", name: "Amara Okafor",      email: "amara@paysmall.ng",    phone: "08012345678", signupDate: "2026-01-15", campaigns: 6,  totalCollected: 1795000, status: "active",    isAdmin: false },
  { id: "u2", name: "Chukwuemeka Obi",   email: "emeka@example.com",    phone: "08123456789", signupDate: "2026-02-03", campaigns: 2,  totalCollected:  480000, status: "active",    isAdmin: false },
  { id: "u3", name: "Fatima Al-Hassan",  email: "fatima@example.com",   phone: "07011223344", signupDate: "2026-03-20", campaigns: 1,  totalCollected:  270000, status: "active",    isAdmin: false },
  { id: "u4", name: "Tunde Adebayo",     email: "tunde@example.com",    phone: "09087654321", signupDate: "2026-04-10", campaigns: 3,  totalCollected:  925000, status: "suspended", isAdmin: false },
  { id: "u5", name: "Ngozi Eze",         email: "ngozi@example.com",    phone: "08099887766", signupDate: "2026-04-22", campaigns: 4,  totalCollected:  610000, status: "active",    isAdmin: false },
  { id: "u6", name: "Musa Garba",        email: "musa@example.com",     phone: "08145678901", signupDate: "2026-05-01", campaigns: 1,  totalCollected:   45000, status: "active",    isAdmin: false },
  { id: "u7", name: "Adaeze Williams",   email: "adaeze@example.com",   phone: "08056789012", signupDate: "2026-05-18", campaigns: 0,  totalCollected:       0, status: "active",    isAdmin: false },
  { id: "u8", name: "Emeka Nwosu",       email: "enwosu@example.com",   phone: "07034567890", signupDate: "2026-06-01", campaigns: 1,  totalCollected:  180000, status: "active",    isAdmin: false },
]

type ConfirmAction = { type: "suspend" | "activate" | "make-admin"; user: AdminUser }

export default function AdminUsersPage() {
  const [loading,  setLoading]  = React.useState(true)
  const [search,   setSearch]   = React.useState("")
  const [users,    setUsers]    = React.useState(MOCK_USERS)
  const [confirm,  setConfirm]  = React.useState<ConfirmAction | null>(null)
  const [acting,   setActing]   = React.useState(false)
  const [page,     setPage]     = React.useState(1)
  const PER_PAGE = 6

  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t) }, [])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, search])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  async function applyAction() {
    if (!confirm) return
    setActing(true)
    await new Promise(r => setTimeout(r, 1000))
    if (confirm.type === "suspend") {
      setUsers(u => u.map(x => x.id === confirm.user.id ? { ...x, status: "suspended" } : x))
      toast.success(`${confirm.user.name} suspended`)
    } else if (confirm.type === "activate") {
      setUsers(u => u.map(x => x.id === confirm.user.id ? { ...x, status: "active" } : x))
      toast.success(`${confirm.user.name} reactivated`)
    } else {
      setUsers(u => u.map(x => x.id === confirm.user.id ? { ...x, isAdmin: true } : x))
      toast.success(`${confirm.user.name} is now an admin`)
    }
    setActing(false)
    setConfirm(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Users</h1>
        <p className="text-xs text-muted-foreground">All registered organisers — {users.length} total</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="bg-card pl-9" aria-label="Search users" />
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
                    {["Name", "Email", "Phone", "Signup Date", "Campaigns", "Total Collected", "Status", ""].map(h => (
                      <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(u => (
                    <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 cursor-pointer"
                      onClick={() => window.location.href = `/admin/users/${u.id}`}>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {u.name}
                        {u.isAdmin && <span className="ml-1.5 rounded bg-amber-500/20 px-1 py-0.5 text-[9px] font-semibold text-amber-400">Admin</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono">{u.phone}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{fmtDate(u.signupDate)}</td>
                      <td className="px-4 py-3 text-center tabular-nums">{u.campaigns}</td>
                      <td className="px-4 py-3 tabular-nums text-foreground">{fmt(u.totalCollected)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={u.status === "active"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-red-500/30 bg-red-500/10 text-red-400"}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <MoreHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.location.href = `/admin/users/${u.id}`}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setConfirm({ type: u.status === "active" ? "suspend" : "activate", user: u })}>
                              {u.status === "active" ? "Suspend Account" : "Reactivate Account"}
                            </DropdownMenuItem>
                            {!u.isAdmin && (
                              <DropdownMenuItem onClick={() => setConfirm({ type: "make-admin", user: u })}>
                                <ShieldAlertIcon className="size-3.5 mr-1.5 text-amber-400" />Make Admin
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="h-7 text-xs">Previous</Button>
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="h-7 text-xs">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog open={!!confirm} onOpenChange={o => !o && setConfirm(null)}>
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Confirm action</DialogTitle>
            {confirm && (
              <p className="text-sm text-muted-foreground">
                {confirm.type === "suspend"    && `Suspend ${confirm.user.name}'s account? They will no longer be able to log in.`}
                {confirm.type === "activate"   && `Reactivate ${confirm.user.name}'s account?`}
                {confirm.type === "make-admin" && `Grant ${confirm.user.name} full admin access? This cannot be undone from the UI.`}
              </p>
            )}
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirm(null)} disabled={acting}>Cancel</Button>
            <Button onClick={applyAction} disabled={acting}
              className={`flex-1 gap-2 ${confirm?.type === "suspend" ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
              {acting && <Loader2Icon className="size-3.5 animate-spin" />}
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
