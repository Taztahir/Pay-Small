"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  CheckCircle2Icon,
  Loader2Icon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusIcon,
} from "lucide-react"

import { campaignsApi } from "@/lib/campaigns"
import type { Campaign, DispatchMethod } from "@/lib/types"
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
import { cn } from "@/lib/utils"

const DISPATCH_OPTIONS = [
  { value: "email_only", label: "Email only" },
  { value: "email_and_sms", label: "Email + SMS" },
] as const

const initialForm = {
  title: "",
  description: "",
  targetAmount: "",
  dispatchMethod: "email_and_sms" as DispatchMethod,
  deadline: "",
}

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

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

function toIsoDeadline(value: string) {
  return new Date(`${value}T23:59:59`).toISOString()
}

export function CreateCampaignModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [form, setForm] = React.useState(initialForm)
  const [isLoading, setIsLoading] = React.useState(false)
  const [createdCampaign, setCreatedCampaign] = React.useState<Campaign | null>(null)

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

  const step1Valid = form.title.trim().length >= 3
  const step2Valid = form.deadline.length > 0

  async function handleCreateCampaign() {
    setIsLoading(true)
    try {
      const response = await campaignsApi.create({
        title: form.title.trim(),
        description: form.description.trim() || null,
        targetAmount: form.targetAmount.trim() || null,
        dispatchMethod: form.dispatchMethod,
        deadline: toIsoDeadline(form.deadline),
      })
      setCreatedCampaign(response.data)
      setStep(3)
      onCreated?.()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      toast.error("Couldn't create campaign", { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handleCreateCampaign()
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
        {step === 1 && (
          <div className="flex flex-col gap-0">
            <div className="flex flex-col gap-3 border-b border-border px-6 py-5">
              <StepDots current={1} total={3} />
              <DialogHeader>
                <DialogTitle className="text-center text-base font-semibold">
                  Campaign Details
                </DialogTitle>
                <p className="text-center text-xs text-muted-foreground">
                  Give your campaign a name and add a short description.
                </p>
              </DialogHeader>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              <Field label="Campaign Name" htmlFor="camp-name">
                <Input
                  id="camp-name"
                  placeholder="e.g. Chioma & Emeka Wedding Aso Ebi"
                  maxLength={60}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="bg-background"
                />
                <p className="text-right text-xs text-muted-foreground">{form.title.length}/60</p>
              </Field>

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

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-0">
            <div className="flex flex-col gap-3 border-b border-border px-6 py-5">
              <StepDots current={2} total={3} />
              <DialogHeader>
                <DialogTitle className="text-center text-base font-semibold">
                  Campaign Setup
                </DialogTitle>
                <p className="text-center text-xs text-muted-foreground">
                  Set the target, collection method, and deadline.
                </p>
              </DialogHeader>
            </div>

            <fieldset disabled={isLoading} className="flex flex-col gap-4 px-6 py-5">
              <Field label="Target amount" htmlFor="camp-target" hint="Optional. Leave blank for an open target.">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    id="camp-target"
                    type="number"
                    min={100}
                    step={100}
                    placeholder="500000"
                    value={form.targetAmount}
                    onChange={(e) => set("targetAmount", e.target.value)}
                    className="bg-background pl-7"
                  />
                </div>
              </Field>

              <Field label="Collection method">
                <div role="group" aria-label="Collection method" className="flex rounded-lg border border-border bg-background p-0.5">
                  {DISPATCH_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => set("dispatchMethod", option.value)}
                      className={cn(
                        "flex-1 rounded-md py-1.5 text-xs font-medium transition-all",
                        form.dispatchMethod === option.value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Field>

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
            </fieldset>

            <div className="flex gap-2 border-t border-border px-6 py-4">
              <Button type="button" variant="outline" className="gap-2" onClick={() => setStep(1)} disabled={isLoading}>
                <ArrowLeftIcon className="size-3.5" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!step2Valid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Creating campaign…
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && createdCampaign && (
          <div className="flex flex-col items-center gap-6 px-6 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2Icon className="size-9 text-primary" />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">Campaign created!</h2>
              <p className="text-sm text-muted-foreground">
                Your campaign is now available in the dashboard. Open it to add contributors and track progress.
              </p>
            </div>

            <div className="w-full rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-left">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Campaign summary</p>
              <p className="text-lg font-semibold text-foreground">{createdCampaign.title}</p>
              {createdCampaign.targetAmount ? (
                <p className="mt-1 text-sm text-muted-foreground">Target: ₦{Number(createdCampaign.targetAmount).toLocaleString("en-NG")}</p>
              ) : null}
              <p className="mt-1 text-sm text-muted-foreground">
                Collection method: {createdCampaign.dispatchMethod === "email_and_sms" ? "Email + SMS" : "Email only"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Deadline: {new Date(createdCampaign.deadline).toLocaleDateString("en-NG", { dateStyle: "medium" })}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  handleOpenChange(false)
                  window.location.href = `/dashboard/campaigns/${createdCampaign.id}`
                }}
              >
                View campaign
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
