import { AdminShell } from "@/components/admin/AdminShell"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell hasIssues={false}>{children}</AdminShell>
}

