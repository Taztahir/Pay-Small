"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2Icon, Trash2Icon } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { usersApi } from "@/lib/admin"
import { useUser } from "@/components/user-context"
import { useRouter } from "next/navigation"

// ── Reusable sub-components ────────────────────────────────────────────────────

function Field({ label, htmlFor, hint, children }: {
  label: string; htmlFor?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function SectionCard({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        {description && <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">{children}</CardContent>
    </Card>
  )
}

// Accessible toggle switch
function Switch({ id, checked, onChange, label }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0",
      )} />
    </button>
  )
}


// ── Main component ─────────────────────────────────────────────────────────────
export function SettingsClient() {
  const router = useRouter()

  // Profile
  const { user, setUser } = useUser()
  const [name,  setName]  = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [profileError, setProfileError] = React.useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = React.useState<string | null>(null)

  // Notifications
  const [smsEnabled,       setSmsEnabled]       = React.useState(true)
  const [reminderTiming,   setReminderTiming]   = React.useState("3-days")
  const [savingNotif,      setSavingNotif]      = React.useState(false)

  // Delete dialog
  const [deleteOpen,   setDeleteOpen]   = React.useState(false)
  const [deletingAcct, setDeletingAcct] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setName(user.name ?? "")
      setEmail(user.email ?? "")
    }
  }, [user])

  async function saveProfile() {
    setSavingProfile(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      const updated = await usersApi.update({ name })
      setUser((current) => current ? { ...current, ...updated.data } : updated.data)
      setProfileSuccess("Profile updated successfully.")
      toast.success("Profile updated")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to save your profile right now."
      setProfileError(message)
      toast.error("Profile update failed", { description: message })
    } finally {
      setSavingProfile(false)
    }
  }

  async function saveNotif() {
    setSavingNotif(true)
    await new Promise(r => setTimeout(r, 800))
    setSavingNotif(false)
    toast.success("Notification preferences saved")
  }

  async function deleteAccount() {
    setDeletingAcct(true)

    try {
      const response = await usersApi.remove()
      if (typeof window !== "undefined") {
        localStorage.removeItem("paysmall_token")
      }
      setDeleteOpen(false)
      toast.success(response?.message || "Account deleted successfully")
      router.replace("/login")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to delete your account right now."
      setDeleteOpen(false)
      toast.error("Account deletion failed", { description: message })
    } finally {
      setDeletingAcct(false)
    }
  }

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div>
          <h1 className="text-sm font-semibold text-foreground">Settings</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">Manage your account and preferences</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex flex-col gap-6 px-4 py-6 lg:px-6">

        {/* ── Section 1: Profile ────────────────────────────────────────────── */}
        <SectionCard title="Profile" description="Update your personal information">
          <Field label="Full Name" htmlFor="profile-name">
            <Input id="profile-name" value={name} onChange={e => setName(e.target.value)} className="bg-background" />
          </Field>
          <Field label="Email" htmlFor="profile-email" hint="Contact support to change your email">
            <Input id="profile-email" type="email" value={email} readOnly
              className="bg-background cursor-not-allowed opacity-60" aria-describedby="email-hint" />
          </Field>
          <Field label="Phone Number" htmlFor="profile-phone">
            <Input id="profile-phone" type="tel" placeholder="0801 234 5678" value={phone}
              onChange={e => setPhone(e.target.value)} className="bg-background" />
          </Field>
          {profileError && (
            <p className="text-sm text-destructive">{profileError}</p>
          )}
          {profileSuccess && (
            <p className="text-sm text-primary">{profileSuccess}</p>
          )}
          <div className="flex justify-end pt-1">
            <Button onClick={saveProfile} disabled={savingProfile}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {savingProfile && <Loader2Icon className="size-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </SectionCard>

        {/* ── Section 2: Notifications ──────────────────────────────────────── */}
        <SectionCard title="Notification Preferences">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="sms-toggle" className="text-sm font-medium text-foreground cursor-pointer">
                Send SMS reminders to unpaid members
              </Label>
              <p className="text-xs text-muted-foreground">Automatically notify members before the deadline</p>
            </div>
            <Switch id="sms-toggle" checked={smsEnabled} onChange={setSmsEnabled} label="SMS reminders toggle" />
          </div>

          <Field label="Reminder timing" htmlFor="reminder-timing">
            <Select value={reminderTiming} onValueChange={setReminderTiming}>
              <SelectTrigger id="reminder-timing" className="w-full bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1-day">1 day before deadline</SelectItem>
                <SelectItem value="3-days">3 days before deadline</SelectItem>
                <SelectItem value="deadline-day">On deadline day</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="flex justify-end pt-1">
            <Button onClick={saveNotif} disabled={savingNotif}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {savingNotif && <Loader2Icon className="size-3.5 animate-spin" />}
              Save Preferences
            </Button>
          </div>
        </SectionCard>

        {/* ── Section 3: Danger Zone ────────────────────────────────────────── */}
        <Card className="border-destructive/40 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Permanently delete your account and all campaign data. This cannot be undone.
              </p>
            </div>
            <Button variant="outline" onClick={() => setDeleteOpen(true)}
              className="shrink-0 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive">
              <Trash2Icon className="size-3.5 mr-1.5" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Delete confirmation dialog ─────────────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="w-full max-w-sm border-border bg-card">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
              <Trash2Icon className="size-6 text-destructive" />
            </div>
            <DialogTitle className="text-base font-semibold text-foreground">Are you sure?</DialogTitle>
            <p className="text-sm text-muted-foreground">
              This will permanently delete your account and all associated data. This cannot be undone.
            </p>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={deleteAccount} disabled={deletingAcct}
              className="w-full gap-2 bg-destructive text-white hover:bg-destructive/90">
              {deletingAcct && <Loader2Icon className="size-3.5 animate-spin" />}
              Yes, delete my account
            </Button>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deletingAcct}
              className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
