import Link from "next/link"
import { PiggyBank, ShieldCheck, Users, TrendingUp } from "lucide-react"

const highlights = [
  { icon: Users, label: "Trusted by 50,000+ Nigerians" },
  { icon: ShieldCheck, label: "Bank-grade security & BVN verification" },
  { icon: TrendingUp, label: "Automated ajo & esusu contributions" },
]

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-primary px-12 py-12 text-primary-foreground lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <PiggyBank className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">PaySmall</span>
        </Link>

        <div className="animate-fade-up max-w-md">
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight">
            Save together, achieve more.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
            Join thousands of Nigerians pooling funds the smart way. Transparent,
            secure, and built on the tradition you already trust.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {highlights.map((item, i) => (
              <li
                key={item.label}
                className="animate-fade-up flex items-center gap-3"
                style={{ animationDelay: `${150 + i * 120}ms` }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm text-primary-foreground/90">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up rounded-xl bg-primary-foreground/10 p-4 backdrop-blur" style={{ animationDelay: "500ms" }}>
          <p className="text-sm text-primary-foreground/70">Group goal reached</p>
          <p className="text-2xl font-bold">₦1,200,000</p>
        </div>

        <div
          className="animate-float pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-primary-foreground/5"
          aria-hidden="true"
        />
      </aside>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="animate-fade-up w-full max-w-sm">
          {/* Mobile brand */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PiggyBank className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              PaySmall
            </span>
          </Link>
          {children}
        </div>
      </section>
    </main>
  )
}
