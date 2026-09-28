import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Solution } from "@/lib/solutions"

export function SolutionCard({ solution, index }: { solution: Solution; index: number }) {
  const isLive = solution.status === "live"
  const number = String(index + 1).padStart(2, "0")

  const cardContent = (
    <>
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <solution.icon className="w-5 h-5 text-primary" />
        </div>
        <span className="font-serif italic text-sm text-muted-foreground/50">{number}</span>
      </div>

      <h3 className="font-serif text-2xl text-foreground mb-2">{solution.title}</h3>
      <p className="text-sm font-semibold text-primary mb-4">{solution.tagline}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">{solution.description}</p>

      {isLive ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          View Solution
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/60">
          Coming Soon
        </span>
      )}
    </>
  )

  const baseClasses =
    "group relative flex flex-col bg-card border rounded-2xl p-8 transition-all duration-300"

  if (!isLive) {
    return (
      <div className={`${baseClasses} border-dashed border-border/70 opacity-70`}>
        {cardContent}
      </div>
    )
  }

  return (
    <Link
      href={solution.href}
      className={`${baseClasses} border-border hover:border-primary/40 hover:shadow-professional hover:-translate-y-1`}
    >
      {cardContent}
    </Link>
  )
}
