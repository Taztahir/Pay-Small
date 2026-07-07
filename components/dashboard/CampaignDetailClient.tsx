"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeftIcon, Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { campaignsApi, membersApi } from "@/lib/campaigns"
import type { Campaign, CampaignMember, CampaignStatus, DispatchMethod } from "@/lib/types"

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function toDatetimeLocal(value: string): string {
  if (!value) return ""
  return value.replace(/Z$/, "").slice(0, 16)
}

export function CampaignDetailClient() {
  const params = useParams<{ campaignId: string }>()
  const router = useRouter()
  const campaignId = params.campaignId

  const [campaign, setCampaign] = React.useState<Campaign | null>(null)
  const [members, setMembers] = React.useState<CampaignMember[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [memberLoading, setMemberLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [editForm, setEditForm] = React.useState({
    title: "",
    targetAmount: "",
    deadline: "",
    status: "draft" as CampaignStatus,
    dispatchMethod: "email_only" as DispatchMethod,
  })
  const [memberForm, setMemberForm] = React.useState({
    guestName: "",
    guestEmail: "",
    phoneNumber: "",
    amountExpected: "",
  })

  const loadCampaign = React.useCallback(async () => {
    if (!campaignId) return

    setLoading(true)
    setError(null)

    try {
      const [campaignResponse, membersResponse] = await Promise.all([
        campaignsApi.get(campaignId),
        membersApi.list(campaignId),
      ])

      setCampaign(campaignResponse.data)
      setMembers(membersResponse.data ?? [])
      setEditForm({
        title: campaignResponse.data.title,
        targetAmount: campaignResponse.data.targetAmount ?? "",
        deadline: toDatetimeLocal(campaignResponse.data.deadline),
        status: campaignResponse.data.status,
        dispatchMethod: campaignResponse.data.dispatchMethod,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to load this campaign." 
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  React.useEffect(() => {
    void loadCampaign()
  }, [loadCampaign])

  async function handleSave() {
    if (!campaignId) return

    setSaving(true)
    setError(null)

    try {
      const payload: Record<string, unknown> = {
        title: editForm.title,
        status: editForm.status,
        dispatchMethod: editForm.dispatchMethod,
      }

      if (editForm.targetAmount !== "") {
        payload.targetAmount = editForm.targetAmount
      } else {
        payload.targetAmount = null
      }

      if (editForm.deadline) {
        const isoDeadline = new Date(editForm.deadline).toISOString()
        payload.deadline = isoDeadline
      }

      const updated = await campaignsApi.update(campaignId, payload)
      setCampaign(updated.data)
      toast.success("Campaign updated")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to save changes."
      setError(message)
      toast.error("Update failed", { description: message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!campaignId || !window.confirm("Delete this campaign?")) return

    setDeleting(true)
    setError(null)

    try {
      await campaignsApi.remove(campaignId)
      toast.success("Campaign deleted")
      router.push("/dashboard/campaigns")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to delete campaign."
      setError(message)
      toast.error("Delete failed", { description: message })
    } finally {
      setDeleting(false)
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!campaignId) return

    setMemberLoading(true)
    setError(null)

    try {
      await membersApi.add(campaignId, {
        guestName: memberForm.guestName,
        guestEmail: memberForm.guestEmail || null,
        phoneNumber: memberForm.phoneNumber || null,
        amountExpected: memberForm.amountExpected,
      })
      setMemberForm({ guestName: "", guestEmail: "", phoneNumber: "", amountExpected: "" })
      await loadCampaign()
      toast.success("Contributor added")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to add contributor."
      setError(message)
      toast.error("Add contributor failed", { description: message })
    } finally {
      setMemberLoading(false)
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!campaignId || !window.confirm("Remove this contributor?")) return

    setMemberLoading(true)
    setError(null)

    try {
      await membersApi.remove(campaignId, memberId)
      await loadCampaign()
      toast.success("Contributor removed")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to remove contributor."
      setError(message)
      toast.error("Remove contributor failed", { description: message })
    } finally {
      setMemberLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="text-lg font-semibold">Campaign not found</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/campaigns">Back to campaigns</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 lg:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/campaigns">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Campaign detail</p>
          <h1 className="text-2xl font-semibold">{campaign.title}</h1>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign overview</CardTitle>
              <CardDescription>Live values from the backend.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-xl font-semibold">{formatNaira(Number(campaign.currentBalance ?? 0))}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="text-xl font-semibold">{formatNaira(Number(campaign.targetAmount ?? 0))}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-semibold capitalize">{campaign.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="text-xl font-semibold">{formatDate(campaign.deadline)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit campaign</CardTitle>
              <CardDescription>Update the campaign details and save.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm((value) => ({ ...value, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={editForm.targetAmount}
                    onChange={(e) => setEditForm((value) => ({ ...value, targetAmount: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm((value) => ({ ...value, deadline: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={editForm.status}
                    onChange={(e) => setEditForm((value) => ({ ...value, status: e.target.value as CampaignStatus }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dispatchMethod">Collection method</Label>
                <select
                  id="dispatchMethod"
                  value={editForm.dispatchMethod}
                  onChange={(e) => setEditForm((value) => ({ ...value, dispatchMethod: e.target.value as DispatchMethod }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="email_only">Email only</option>
                  <option value="email_and_sms">Email + SMS</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                  Save changes
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-2">
                  {deleting ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <Trash2Icon className="h-4 w-4" />}
                  Delete campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contributors</CardTitle>
              <CardDescription>Use the real member endpoints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddMember} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Name</Label>
                  <Input
                    id="guestName"
                    value={memberForm.guestName}
                    onChange={(e) => setMemberForm((value) => ({ ...value, guestName: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={memberForm.guestEmail}
                      onChange={(e) => setMemberForm((value) => ({ ...value, guestEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone</Label>
                    <Input
                      id="phoneNumber"
                      value={memberForm.phoneNumber}
                      onChange={(e) => setMemberForm((value) => ({ ...value, phoneNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountExpected">Amount expected</Label>
                  <Input
                    id="amountExpected"
                    type="number"
                    value={memberForm.amountExpected}
                    onChange={(e) => setMemberForm((value) => ({ ...value, amountExpected: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" disabled={memberLoading} className="gap-2">
                  {memberLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <PlusIcon className="h-4 w-4" />}
                  Add contributor
                </Button>
              </form>

              <div className="space-y-3">
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No contributors yet.</p>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium">{member.guestName}</p>
                        <p className="text-sm text-muted-foreground">{member.guestEmail ?? member.phoneNumber ?? "No contact details"}</p>
                        <p className="text-sm text-muted-foreground">Expected: {formatNaira(Number(member.amountExpected ?? 0))}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)} className="gap-2">
                        <Trash2Icon className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
