import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminShell } from "@/components/admin/AdminShell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Must be authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/sign-in")

  // 2. Must have is_admin = true in the users table
  //    If the column doesn't exist yet, this will return null → redirect
  const { data: profile, error } = await supabase
    .from("users")
    .select("is_admin, status")
    .eq("id", user.id)
    .single()

  if (error || !profile?.is_admin) {
    redirect("/dashboard")
  }

  // 3. Check for unresolved webhook failures (for system status badge)
  //    Falls back to "operational" if webhook_logs table doesn't exist yet
  let hasIssues = false
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from("webhook_logs")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed")
      .eq("resolved", false)
      .gte("created_at", since)
    hasIssues = (count ?? 0) > 0
  } catch {
    // webhook_logs table not yet created — treat as operational
  }

  return <AdminShell hasIssues={hasIssues}>{children}</AdminShell>
}
