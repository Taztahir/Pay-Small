import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { CTA } from "@/components/cta"
import { SiteFooter } from "@/components/site-footer"
// import Hero from "@/components/hero-section-7"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
