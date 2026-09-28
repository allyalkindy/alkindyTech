"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { solutions } from "@/lib/solutions"
import { SolutionCard } from "./solution-card"

export function SolutionsGrid() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return solutions
    return solutions.filter((solution) =>
      [solution.title, solution.tagline, solution.description].some((field) =>
        field.toLowerCase().includes(q)
      )
    )
  }, [query])

  const isSearching = query.trim().length > 0

  return (
    <div className="max-w-6xl">
      <div className="relative max-w-sm mb-10">
        <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search solutions…"
          className="w-full pl-11 pr-10 py-3 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-border/70 rounded-2xl p-12 text-center">
          <p className="font-serif text-xl text-foreground mb-2">No solutions match &ldquo;{query}&rdquo;</p>
          <p className="text-sm text-muted-foreground mb-6">
            Try a different search, or clear it to see everything.
          </p>
          <button
            onClick={() => setQuery("")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((solution, index) => (
            <SolutionCard key={solution.slug} solution={solution} index={index} />
          ))}

          {!isSearching && (
            <div className="group relative flex flex-col bg-card border border-dashed border-border/70 rounded-2xl p-8 opacity-70">
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-lg">+</span>
                </div>
                <span className="font-serif italic text-sm text-muted-foreground/50">
                  {String(solutions.length + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">More on the way</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                New tools land here as they're built. Got a small, sharp idea worth
                building? Let me know.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
