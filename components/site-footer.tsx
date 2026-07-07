"use client"

import { useState } from "react"
import Link from "next/link"
import { PiggyBank, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { newsletterApi } from "@/lib/newsletter"
import { ApiError } from "@/lib/api"

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Security", href: "/#security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Compliance", href: "/compliance" },
    ],
  },
]

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    setErrorMsg(null)

    try {
      await newsletterApi.subscribe({ email })
      setStatus("success")
      setEmail("")
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      setErrorMsg(message)
      setStatus("error")
    }
  }

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PiggyBank className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                PaySmall
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The trusted way for Nigerian communities to save and contribute
              together.
            </p>

            {/* Newsletter subscribe */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-foreground">
                Stay in the loop
              </p>
              {status === "success" ? (
                <p className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  You&apos;re subscribed!
                </p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-2 sm:flex-row"
                  aria-label="Newsletter subscription"
                >
                  <div className="flex-1">
                    <label htmlFor="footer-email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="footer-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 text-sm"
                      aria-describedby={errorMsg ? "footer-email-error" : undefined}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={status === "loading"}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>
              )}
              {errorMsg && (
                <p
                  id="footer-email-error"
                  role="alert"
                  className="mt-1 text-xs text-destructive"
                >
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} PaySmall. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
