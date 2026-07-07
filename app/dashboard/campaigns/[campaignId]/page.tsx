import type { Metadata } from "next"
import { CampaignDetailClient } from "@/components/dashboard/CampaignDetailClient"

export const metadata: Metadata = {
  title: "Campaign Details — PaySmall",
  description: "View and edit campaign details, contributors, and balances.",
}

export default function CampaignDetailPage() {
  return <CampaignDetailClient />
}
