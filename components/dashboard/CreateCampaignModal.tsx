"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  CheckCircle2Icon,
  CopyIcon,
  Loader2Icon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
} from "lucide-react"

import { createCampaign, type CampaignRow } from "@/lib/api/campaigns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ── Constants ─────────────────────────────────────────────────────────────────
const CAMPAIGN_TYPES = [
  { value: "ajo",          label: "Ajo" },
  { value: "aso-ebi",      label: "Aso Ebi" },
  { value: "burial",       label: "Burial Committee" },
  { value: "church",       label: "Church / Mosque Project" },
  { value: "nysc",         label: "NYSC Group" },
  { value: "family",       label: "Family Contribution" },
  { value: "class-reunion",label: "Class Reunion" },
  { value: "street",       label: "Street Association" },
  { value: "other",        label: "Other" },
]

const PAYMENT_TYPES = [
  { value: "one-off",  label: "One-off" },
  { value: "monthly",  label: "Monthly" },
  { value: "weekly",   label: "Weekly" },
]

// ── Initial state ─────────────────────────────────────────────────────────────
const initialForm = {
  name: "",
  type: "",
  description: "",
  amountPerPerson: "",
  paymentType: "",
  expectedMembers: "",
  deadline: "",
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i + 1 === current
              ? "w-6 bg-primary"
              : i + 1 < current
              ? "w-2 bg-primary/40"
              : "w-2 bg-border"
          )}
        />
      ))}
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

// ── Tomorrow helper ───────────────────────────────────────────────────────────
function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function CreateCampaignModal() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [form, setForm] = React.useState(initialForm)
  const [isLoading, setIsLoading] = React.useState(false)
  const [createdCampaign, setCreatedCampaign] = React.useState<CampaignRow | null>(null)

  // Reset on close
  function handleOpenChange(val: boolean) {
    setOpen(val)
    if (!val) {
      setTimeout(() => {
        setStep(1)
        setForm(initialForm)
        setCreatedCampaign(null)
        setIsLoading(false)
      }, 300)
    }
  }

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  // ── Step 1 validation ────────────────────────────────────────────────────
  const step1Valid = form.name.trim().length > 0 && form.type.length > 0

  // ── Step 2 validation ────────────────────────────────────────────────────
  const step2Valid =
    Number(form.amountPerPerson) >= 100 &&
    form.paymentType.length > 0 &&
    Number(form.expectedMembers) >= 1 &&
    form.deadline.length > 0

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleCreateCampaign() {
    setIsLoading(true)
    try {
      const { campaign } = await createCampaign({
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim() || undefined,
        amountPerPerson: Number(form.amountPerPerson),
        paymentType: form.paymentType,
        expectedMembers: Number(form.expectedMembers),
        deadline: form.deadline,
      })
      setCreatedCampaign(campaign)
      setStep(3)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      toast.error("Couldn't create campaign", { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Copy account number ──────────────────────────────────────────────────
  async function copyAccount() {
    if (!createdCampaign) return
    await navigator.clipboard.writeText(createdCampaign.virtual_account_number)
    toast.success("Account number copied!")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" />
        }
      >
        <PlusIcon className="size-3.5" />
        Create Campaign
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-md border-border bg-card p-0 overflow-hidden"
        showCloseButton={step !== 3}
      >
        {/* ── STEP 1 — Campaign Details ─────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-0">
            <div className="flex flex-col gap-3 border-b border-border px-6 py-5">
              <StepDots current={1} total={3} />
              <DialogHeader>
                <DialogTitle className="text-center text-base font-semibold">
                  Campaign Details
                </DialogTitle>
                <p className="text-center text-xs text-muted-foreground">
                  Give your campaign a name and choose its type.
                </p>
              </DialogHeader>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              {/* Campaign Name */}
              <Field label="Campaign Name" htmlFor="camp-name">
                <Input
                  id="camp-name"
                  placeholder="e.g. Chioma & Emeka Wedding Aso Ebi"
                  maxLength={60}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="bg-background"
                />
                <p className="text-right text-xs text-muted-foreground">
                  {form.name.length}/60
                </p>
              </Field>

              {/* Campaign Type */}
              <Field label="Campaign Type" htmlFor="camp-type">
                <Select
                  value={form.type}
                  onValueChange={(v) => v && set("type", v)}
                >
                  <SelectTrigger
                    id="camp-type"
                    className="w-full bg-background"
                  >
                    <SelectValue placeholder="Select a type…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CAMPAIGN_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Description */}
              <Field
                label="Description (optional)"
                htmlFor="camp-desc"
                hint={`${form.description.length}/200 characters`}
              >
                <textarea
                  id="camp-desc"
                  rows={3}
                  maxLength={200}
                  placeholder="Brief description of this campaign…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring"
                />
              </Field>
            </div>

            <div className="border-t border-border px-6 py-4">
              <Button
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!step1Valid}
                onClick={() => setStep(2)}
              >
                Next
                <ArrowRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Payment Setup ────────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-0">
            <div className="flex flex-col gap-3 border-b border-border px-6 py-5">
              <StepDots current={2} total={3} />
              <DialogHeader>
                <DialogTitle className="text-center text-base font-semibold">
                  Payment Setup
                </DialogTitle>
                <p className="text-center text-xs text-muted-foreground">
                  Set the amount, schedule, and deadline.
                </p>
              </DialogHeader>
            </div>

            <fieldset disabled={isLoading} className="flex flex-col gap-4 px-6 py-5">
              {/* Amount Per Person */}
              <Field label="Amount Per Person" htmlFor="camp-amount" hint="Minimum ₦100">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    id="camp-amount"
                    type="number"
                    min={100}
                    step={100}
                    placeholder="5000"
                    value={form.amountPerPerson}
                    onChange={(e) => set("amountPerPerson", e.target.value)}
                    className="bg-background pl-7"
                  />
                </div>
              </Field>

              {/* Payment Type — segmented toggle */}
              <Field label="Payment Type">
                <div
                  role="group"
                  aria-label="Payment type"
                  className="flex rounded-lg border border-border bg-background p-0.5"
                >
                  {PAYMENT_TYPES.map((pt) => (
                    <button
                      key={pt.value}
                      type="button"
                      onClick={() => set("paymentType", pt.value)}
                      className={cn(
                        "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
                        form.paymentType === pt.value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Expected Members */}
              <Field label="Number of Members Expected" htmlFor="camp-members">
                <Input
                  id="camp-members"
                  type="number"
                  min={1}
                  placeholder="28"
                  value={form.expectedMembers}
                  onChange={(e) => set("expectedMembers", e.target.value)}
                  className="bg-background"
                />
              </Field>

              {/* Deadline */}
              <Field label="Deadline" htmlFor="camp-deadline">
                <Input
                  id="camp-deadline"
                  type="date"
                  min={getTomorrow()}
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  className="bg-background"
                />
              </Field>

              {/* Target amount preview */}
              {Number(form.amountPerPerson) >= 100 && Number(form.expectedMembers) >= 1 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Target amount</p>
                  <p className="text-lg font-bold text-primary">
                    ₦{(Number(form.amountPerPerson) * Number(form.expectedMembers)).toLocaleString("en-NG")}
                  </p>
                </div>
              )}
            </fieldset>

            <div className="flex gap-2 border-t border-border px-6 py-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                <ArrowLeftIcon className="size-3.5" />
                Back
              </Button>
              <Button
                className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!step2Valid || isLoading}
                onClick={handleCreateCampaign}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Generating your account number…
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Success ─────────────────────────────────────────── */}
        {step === 3 && createdCampaign && (
          <div className="flex flex-col items-center gap-6 px-6 py-8 text-center">
            {/* Checkmark */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2Icon className="size-9 text-primary" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">Campaign Created!</h2>
              <p className="text-sm text-muted-foreground">
                Your virtual account is ready to receive payments.
              </p>
            </div>

            {/* Account details box */}
            <div className="w-full rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-left">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Virtual Account Details
              </p>
              <p className="text-lg font-semibold text-foreground">
                {createdCampaign.virtual_account_bank}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-mono text-2xl font-bold tracking-widest text-primary">
                  {createdCampaign.virtual_account_number}
                </p>
                <button
                  type="button"
                  onClick={copyAccount}
                  aria-label="Copy account number"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <CopyIcon className="size-4" />
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Account Name:{" "}
                <span className="font-medium text-foreground">
                  {createdCampaign.virtual_account_name}
                </span>
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Share this account number with your members. Anyone can pay from
              any bank, POS agent, or USSD.
            </p>

            {/* Actions */}
            <div className="flex w-full flex-col gap-2">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  handleOpenChange(false)
                  // TODO: open AddMemberModal with createdCampaign.id
                }}
              >
                Add Members Now
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => {
                  handleOpenChange(false)
                  window.location.href = `/dashboard/campaigns/${createdCampaign.id}`
                }}
              >
                I&apos;ll do this later
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
