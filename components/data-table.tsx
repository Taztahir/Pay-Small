"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ── Types ────────────────────────────────────────────────────────────────────
type CampaignType = "ajo" | "aso-ebi" | "burial" | "church" | "other"
type CampaignStatus = "active" | "completed" | "expired"

interface Campaign {
  name: string
  type: CampaignType
  amount: number
  paid: number
  total: number
  status: CampaignStatus
}

// ── Mock data ────────────────────────────────────────────────────────────────
const mockCampaigns: Campaign[] = [
  {
    name: "Aso Ebi — Chioma & Emeka Wedding",
    type: "aso-ebi",
    amount: 15000,
    paid: 18,
    total: 28,
    status: "active",
  },
  {
    name: "Mama Bello Burial Committee",
    type: "burial",
    amount: 25000,
    paid: 15,
    total: 15,
    status: "completed",
  },
  {
    name: "Adeyemi Family Monthly Ajo",
    type: "ajo",
    amount: 5000,
    paid: 7,
    total: 12,
    status: "active",
  },
  {
    name: "Grace Chapel Building Fund",
    type: "church",
    amount: 10000,
    paid: 22,
    total: 40,
    status: "active",
  },
  {
    name: "Lagos Alumni Reunion Levy",
    type: "other",
    amount: 8000,
    paid: 9,
    total: 30,
    status: "expired",
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

const typeStyles: Record<CampaignType, string> = {
  "ajo":     "bg-[oklch(0.21_0.025_164)] text-primary border-primary/20",
  "aso-ebi": "bg-[oklch(0.21_0.04_280)] text-[oklch(0.72_0.15_280)] border-[oklch(0.72_0.15_280)/20%]",
  "burial":  "bg-[oklch(0.18_0.02_30)]  text-[oklch(0.70_0.14_30)]  border-[oklch(0.70_0.14_30)/20%]",
  "church":  "bg-[oklch(0.18_0.04_72)]  text-[oklch(0.75_0.15_72)]  border-[oklch(0.75_0.15_72)/20%]",
  "other":   "bg-muted text-muted-foreground border-border",
}

const typeLabels: Record<CampaignType, string> = {
  "ajo":     "Ajo",
  "aso-ebi": "Aso Ebi",
  "burial":  "Burial",
  "church":  "Church",
  "other":   "Other",
}

const statusStyles: Record<CampaignStatus, string> = {
  active:    "bg-primary/10 text-primary border-primary/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  expired:   "bg-destructive/10 text-red-400 border-destructive/20",
}

const statusLabels: Record<CampaignStatus, string> = {
  active:    "Active",
  completed: "Completed",
  expired:   "Expired",
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ paid, total }: { paid: number; total: number }) {
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{pct}%</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function DataTable({ data: _ }: { data: unknown[] }) {
  return (
    <Card className="border-border bg-card mx-4 lg:mx-6">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Recent Campaigns</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Your latest contribution groups and their collection progress.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Campaign</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Per Person</TableHead>
                <TableHead className="text-muted-foreground">Members</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Progress</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow
                  key={campaign.name}
                  className="border-border hover:bg-accent/40 transition-colors"
                >
                  {/* Campaign name */}
                  <TableCell className="font-medium max-w-[200px] truncate" title={campaign.name}>
                    {campaign.name}
                  </TableCell>

                  {/* Type badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${typeStyles[campaign.type]}`}
                    >
                      {typeLabels[campaign.type]}
                    </Badge>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="font-mono text-sm">
                    {formatNaira(campaign.amount)}
                  </TableCell>

                  {/* Paid / Total */}
                  <TableCell>
                    <span className="text-foreground font-medium">{campaign.paid}</span>
                    <span className="text-muted-foreground">/{campaign.total}</span>
                  </TableCell>

                  {/* Progress bar */}
                  <TableCell className="hidden md:table-cell">
                    <ProgressBar paid={campaign.paid} total={campaign.total} />
                  </TableCell>

                  {/* Status badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${statusStyles[campaign.status]}`}
                    >
                      {statusLabels[campaign.status]}
                    </Badge>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
