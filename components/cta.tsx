"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useInView } from "@/hooks/use-in-view"
import { contactApi } from "@/lib/contact"
import { ApiError } from "@/lib/api"

export function CTA() {
  const [ref, inView] = useInView({ threshold: 0.2 })
  const [open, setOpen] = useState(false)

  return (
    <>
      <section id="cta" className="bg-background px-4 py-20 sm:px-6">
        <div
          ref={ref}
          className={`mx-auto max-w-5xl rounded-3xl bg-primary px-6 py-16 text-center sm:px-12 reveal-scale ${inView ? "in-view" : ""}`}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Start saving with your community today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Join thousands of Nigerians reaching their goals together. Create your
            first contribution group in minutes — it&apos;s free to get started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className={`bg-background text-foreground hover:bg-background/90 reveal stagger-1 ${inView ? "in-view" : ""}`}
            >
              <Link href="/sign-up">
                Create your group
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setOpen(true)}
              className={`border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground reveal stagger-2 ${inView ? "in-view" : ""}`}
            >
              Talk to our team
            </Button>
          </div>
        </div>
      </section>

      {/* Contact modal */}
      {open && (
        <ContactModal onClose={() => setOpen(false)} />
      )}
    </>
  )
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)
    setStatus("loading")

    const data = new FormData(e.currentTarget)

    try {
      await contactApi.submit({
        firstName: data.get("firstName") as string,
        lastName: data.get("lastName") as string,
        email: data.get("email") as string,
        subject: (data.get("subject") as string) || null,
        message: data.get("message") as string,
      })
      setStatus("success")
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 id="contact-modal-title" className="text-lg font-semibold text-foreground">
            Get in touch
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close contact form"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
            <p className="text-base font-medium text-foreground">Message sent!</p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll get back to you as soon as possible.
            </p>
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="contact-first-name">First name</Label>
                <Input
                  id="contact-first-name"
                  name="firstName"
                  type="text"
                  placeholder="Ada"
                  required
                  minLength={2}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="contact-last-name">Last name</Label>
                <Input
                  id="contact-last-name"
                  name="lastName"
                  type="text"
                  placeholder="Okafor"
                  required
                  minLength={2}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="contact-subject">Subject (optional)</Label>
              <Input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="Integration query…"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="contact-message">Message</Label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Tell us how we can help…"
                required
                minLength={5}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {errorMsg && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
