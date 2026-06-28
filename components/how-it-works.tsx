"use client"

import { UserPlus, CalendarClock, Wallet } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const steps = [
  {
    icon: UserPlus,
    title: "Create or join a group",
    description:
      "Set up a contribution circle with friends, family, or colleagues. Invite members and agree on the amount and schedule.",
  },
  {
    icon: CalendarClock,
    title: "Contribute automatically",
    description:
      "Everyone pays in on the agreed date. PaySmall handles reminders and collections so no one falls behind.",
  },
  {
    icon: Wallet,
    title: "Receive your payout",
    description:
      "Each member gets the full pot on their turn — sent straight to their bank account, transparent and on time.",
  },
]

export function HowItWorks() {
  const [headingRef, headingInView] = useInView({ threshold: 0.2 })
  const [stepsRef, stepsInView] = useInView({ threshold: 0.1 })

  return (
    <section id="how-it-works" className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <div
          ref={headingRef}
          className={`mx-auto max-w-2xl text-center reveal ${headingInView ? "in-view" : ""}`}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three simple steps to save smarter
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            We digitized the ajo your grandmother trusted — now faster, safer,
            and fully in your control.
          </p>
        </div>

        {/* Step cards */}
        <div ref={stepsRef}>
        <ol
          className="mt-14 grid gap-8 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={`relative rounded-2xl border border-border bg-card p-8 card-hover reveal stagger-${index + 1} ${stepsInView ? "in-view" : ""}`}
            >
              <span className="absolute right-6 top-6 text-5xl font-bold text-accent">
                {index + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  )
}
