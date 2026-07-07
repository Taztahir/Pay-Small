"use client"

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
import type { Campaign } from "@/lib/types"

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`
}

function statusBadgeClass(status: Campaign["status"]): string {
  switch (status) {
    case "active":
      return "bg-primary/10 text-primary border-primary/20"
    case "closed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function DataTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Card className="mx-4 border-border bg-card lg:mx-6">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Recent Campaigns</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Your latest contribution groups and their current balance.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No campaigns yet. Create your first campaign to populate this table.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Campaign</TableHead>
                  <TableHead className="text-muted-foreground">Collection Method</TableHead>
                  <TableHead className="text-muted-foreground">Target</TableHead>
                  <TableHead className="text-muted-foreground">Collected</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className="border-border transition-colors hover:bg-accent/40"
                  >
                    <TableCell className="max-w-[220px] truncate font-medium" title={campaign.title}>
                      {campaign.title}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {campaign.dispatchMethod === "email_and_sms"
                          ? "Email + SMS"
                          : campaign.dispatchMethod === "email_only"
                            ? "Email only"
                            : "Other"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatNaira(Number(campaign.targetAmount ?? 0))}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatNaira(Number(campaign.currentBalance ?? 0))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs font-medium ${statusBadgeClass(campaign.status)}`}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
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
        )}
      </CardContent>
    </Card>
  )
}
