"use client"

import * as React from "react"
import { usersApi } from "@/lib/admin"
import { getToken } from "@/lib/api"
import type { CurrentUser } from "@/lib/types"

type UserContextValue = {
  user: CurrentUser | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>
}

const UserContext = React.createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<CurrentUser | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refreshUser = React.useCallback(async () => {
    const token = getToken()

    if (!token) {
      setUser(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await usersApi.me()
      setUser(response?.data ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load your profile.")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const value = React.useMemo(
    () => ({ user, loading, error, refreshUser, setUser }),
    [user, loading, error, refreshUser]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = React.useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
