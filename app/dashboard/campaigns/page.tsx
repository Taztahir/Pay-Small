import type { Metadata } from "next"
import { CampaignsClient } from "@/components/dashboard/CampaignsClient"

export const metadata: Metadata = {
  title: "Campaigns — PaySmall",
  description: "Manage all your contribution campaigns, track collections, and send reminders.",
}

export default function CampaignsPage() {
  return <CampaignsClient />
}
