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
import { profileApi, transfersApi } from "@/lib/transfers-and-profile"
import type { Bank, OrganizerProfile } from "@/lib/types"
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
  const [payoutProfile, setPayoutProfile] = React.useState<OrganizerProfile | null>(null)
  const [banks, setBanks] = React.useState<Bank[]>([])
  const [selectedBankCode, setSelectedBankCode] = React.useState("")
  const [accountNumber, setAccountNumber] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [accountName, setAccountName] = React.useState<string | null>(null)
  const [bankLoading, setBankLoading] = React.useState(true)
  const [bankError, setBankError] = React.useState<string | null>(null)
  const [bankSuccess, setBankSuccess] = React.useState<string | null>(null)
  const [verifyingBank, setVerifyingBank] = React.useState(false)

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

  React.useEffect(() => {
    let active = true

    async function loadPayoutSettings() {
      setBankLoading(true)
      setBankError(null)

      const banksPromise = transfersApi.listBanks()
      const profilePromise = profileApi.get()

      const [banksResult, profileResult] = await Promise.allSettled([
        banksPromise,
        profilePromise,
      ])

      if (!active) {
        setBankLoading(false)
        return
      }

      if (banksResult.status === "fulfilled") {
        setBanks(banksResult.value.data ?? [])
      } else {
        console.error("loadPayoutSettings banks error:", banksResult.reason)
        setBanks([])
        const message = banksResult.reason instanceof Error ? banksResult.reason.message : "Unable to load bank list."
        setBankError(message)
      }

      if (profileResult.status === "fulfilled") {
        setPayoutProfile(profileResult.value.data)
        setSelectedBankCode(profileResult.value.data.bankCode ?? "")
        setAccountNumber(profileResult.value.data.accountNumber ?? "")
        setPhoneNumber(profileResult.value.data.phoneNumber ?? "")
        setAccountName(profileResult.value.data.accountName ?? null)
      } else {
        console.error("loadPayoutSettings profile error:", profileResult.reason)
        const message = profileResult.reason instanceof Error ? profileResult.reason.message : "Unable to load payout profile."
        setBankError(message)
      }

      setBankLoading(false)
    }

    void loadPayoutSettings()

    return () => {
      active = false
    }
  }, [])

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
            <Select
              value={reminderTiming}
              onValueChange={(value) => setReminderTiming(value ?? "")}
            >
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

        <SectionCard
          title="Payout account"
          description="Configure your bank account for campaign withdrawals."
        >
          {bankLoading ? (
            <div className="text-sm text-muted-foreground">Loading payout settings…</div>
          ) : (
            <>
              {payoutProfile?.verifiedAt ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-foreground">
                  <p className="font-medium text-foreground">Payout account verified</p>
                  <p className="text-sm text-muted-foreground">
                    Funds will be withdrawn to your saved account once you request a payout.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-foreground">
                  <p className="font-medium text-foreground">No verified payout account</p>
                  <p className="text-sm text-muted-foreground">
                    Enter a bank account and verify it so withdrawals can be completed.
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bankCode">Bank</Label>
                  <Select
                    value={selectedBankCode}
                    onValueChange={(value) => setSelectedBankCode(value ?? "")}
                    disabled={bankLoading}
                  >
                    <SelectTrigger id="bankCode" className="w-full bg-background" aria-label="Bank">
                      <SelectValue placeholder={bankLoading ? "Loading banks…" : "Select a bank"}>
                        {(value) => {
                          if (!value) return null
                          return banks.find((bank) => bank.code === value)?.name ?? value
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {banks.length === 0 ? (
                        <SelectItem value="" disabled>
                          No banks available
                        </SelectItem>
                      ) : (
                        banks.map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="accountNumber">Account number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="phoneNumber">Phone number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0801 234 5678"
                  />
                </div>
              </div>

              {accountName && (
                <p className="text-sm text-muted-foreground">Account name: <span className="font-medium text-foreground">{accountName}</span></p>
              )}

              {bankError && <p className="text-sm text-destructive">{bankError}</p>}
              {bankSuccess && <p className="text-sm text-primary">{bankSuccess}</p>}

              <div className="flex justify-end pt-1">
                <Button onClick={async () => {
                  setVerifyingBank(true)
                  setBankError(null)
                  setBankSuccess(null)

                  try {
                    const verified = await profileApi.verifyBank({
                      bankCode: selectedBankCode,
                      accountNumber,
                      phoneNumber,
                    })
                    setPayoutProfile(verified.data)
                    setAccountName(verified.data.accountName)
                    setBankSuccess("Payout account verified successfully.")
                    toast.success("Payout account updated")
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Unable to verify payout account."
                    setBankError(message)
                    toast.error("Verification failed", { description: message })
                  } finally {
                    setVerifyingBank(false)
                  }
                }} disabled={verifyingBank || bankLoading || !selectedBankCode || !accountNumber || !phoneNumber}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  {verifyingBank && <Loader2Icon className="size-3.5 animate-spin" />}
                  Save payout account
                </Button>
              </div>
            </>
          )}
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
