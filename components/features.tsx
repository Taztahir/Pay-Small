"use client"

import {
  ShieldCheck,
  Bell,
  LineChart,
  Banknote,
  Lock,
  Users,
} from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const features = [
  {
    icon: ShieldCheck,
    title: "Transparent & secure",
    description:
      "Every contribution and payout is recorded. Members see exactly where the money is at all times.",
  },
  {
    icon: Bell,
    title: "Automated reminders",
    description:
      "Smart notifications keep everyone on track, so contributions are never missed or forgotten.",
  },
  {
    icon: Banknote,
    title: "Instant bank payouts",
    description:
      "Payouts land directly in members' Nigerian bank accounts — no waiting, no middlemen.",
  },
  {
    icon: LineChart,
    title: "Track your goals",
    description:
      "Visual dashboards show group progress and your personal savings milestones in real time.",
  },
  {
    icon: Lock,
    title: "Verified members",
    description:
      "BVN-backed identity checks ensure you only save with people who are who they say they are.",
  },
  {
    icon: Users,
    title: "Flexible group sizes",
    description:
      "Run a small family circle or a large cooperative — PaySmall scales to fit any community.",
  },
]

const staggerClasses = [
  "stagger-1",
  "stagger-2",
  "stagger-3",
  "stagger-4",
  "stagger-5",
  "stagger-6",
]

export function Features() {
  const [headingRef, headingInView] = useInView({ threshold: 0.2 })
  const [gridRef, gridInView] = useInView({ threshold: 0.05 })

  return (
    <section id="features" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <div
          ref={headingRef}
          className={`mx-auto max-w-2xl text-center reveal ${headingInView ? "in-view" : ""}`}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Features
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to save with confidence
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Built for the way Nigerians already save, with the tools to make it
            effortless.
          </p>
        </div>

        {/* Feature cards */}
        <div ref={gridRef}>
        <ol
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <li
              key={feature.title}
              className={`rounded-2xl border border-border bg-card p-6 card-hover hover:border-primary/40 reveal ${staggerClasses[i]} ${gridInView ? "in-view" : ""}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  )
}
