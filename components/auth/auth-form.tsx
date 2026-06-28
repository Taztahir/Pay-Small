"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthMode = "sign-in" | "sign-up"

const copy = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to manage your contribution groups.",
    submit: "Sign in",
    switchText: "New to PaySmall?",
    switchLabel: "Create an account",
    switchHref: "/sign-up",
  },
  "sign-up": {
    title: "Create your account",
    subtitle: "Start saving with your community in minutes.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/sign-in",
  },
} as const

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const t = copy[mode]
  const isSignUp = mode === "sign-up"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Frontend demo only — wire up to real auth when ready.
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t.title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {isSignUp && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Adaeze Okafor"
              required
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "sign-in" && (
              <Link
                href="#"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder="••••••••"
              required
              minLength={8}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 bg-primary text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              {t.submit}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {isSignUp && (
        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.switchText}{" "}
        <Link
          href={t.switchHref}
          className="font-medium text-primary hover:underline"
        >
          {t.switchLabel}
        </Link>
      </p>
    </div>
  )
}
