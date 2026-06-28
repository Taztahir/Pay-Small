"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInView } from "@/hooks/use-in-view"

export function CTA() {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
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
            className={`border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground reveal stagger-2 ${inView ? "in-view" : ""}`}
          >
            Talk to our team
          </Button>
        </div>
      </div>
    </section>
  )
}
