"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInView } from "@/hooks/use-in-view"

export function Hero() {
  const [sectionRef, inView] = useInView({ threshold: 0.1 })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24">
        {/* Text content — slide up staggered */}
        <div className="flex flex-col items-start gap-6">
          <span
            className={`inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-sm font-medium text-accent-foreground reveal ${inView ? "in-view" : ""}`}
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Trusted by 50,000+ Nigerians
          </span>

          <h1
            className={`text-pretty text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl reveal stagger-1 ${inView ? "in-view" : ""}`}
          >
            Save together,{" "}
            <span className="text-primary">achieve more.</span>
          </h1>

          <p
            className={`max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground reveal stagger-2 ${inView ? "in-view" : ""}`}
          >
            PaySmall brings the trusted tradition of ajo and esusu online. Pool
            funds with people you trust, automate contributions, and reach your
            goals faster — all transparent and secure.
          </p>

          <div
            className={`flex flex-col gap-3 sm:flex-row reveal stagger-3 ${inView ? "in-view" : ""}`}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
            >
              <Link href="/sign-up">
                Start a group
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border bg-transparent text-foreground hover:bg-accent"
            >
              See how it works
            </Button>
          </div>

          <div
            className={`flex items-center gap-2 pt-2 text-sm text-muted-foreground reveal stagger-4 ${inView ? "in-view" : ""}`}
          >
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Bank-grade security · No hidden fees
          </div>
        </div>

        {/* Image panel — slide in from right */}
        <div
          className={`relative reveal-right ${inView ? "in-view" : ""}`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src="/community-savings.png"
              alt="A group of friends celebrating reaching a savings goal together on a phone"
              width={720}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="animate-float absolute -bottom-5 -left-5 hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:block">
            <p className="text-sm text-muted-foreground">Group goal reached</p>
            <p className="text-2xl font-bold text-foreground">₦1,200,000</p>
          </div>
        </div>
      </div>
    </section>
  )
}
