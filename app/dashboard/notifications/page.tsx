import type { Metadata } from "next"
import { NotificationsClient } from "@/components/dashboard/NotificationsClient"

export const metadata: Metadata = {
  title: "Notifications — PaySmall",
  description: "Manage your email and SMS notification settings.",
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
