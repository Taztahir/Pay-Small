import type { Metadata } from "next"
import { SettingsClient } from "@/components/dashboard/SettingsClient"

export const metadata: Metadata = {
  title: "Settings — PaySmall",
  description: "Manage your account, notification preferences, and API integrations.",
}

export default function SettingsPage() {
  return <SettingsClient />
}
