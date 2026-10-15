"use client"

// One page inside the book. react-pageflip needs a real DOM node for every
// page up front (it animates adjacent pages during a turn), but actually
// rasterizing every page of a long PDF at once would be slow and memory-
// heavy. So every page slot exists immediately, but only renders its real
// bitmap once it's within `shouldRender`'s window around the current page
// — everything else shows a plain placeholder until the reader gets close.
import { forwardRef, useEffect, useRef, useState } from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { renderPageToCanvas } from "./pdf-engine"

interface PageCanvasProps {
  pdf: PDFDocumentProxy
  pageNumber: number
  pageCount: number
  shouldRender: boolean
}

export const PageCanvas = forwardRef<HTMLDivElement, PageCanvasProps>(
  ({ pdf, pageNumber, pageCount, shouldRender }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [rendered, setRendered] = useState(false)

    useEffect(() => {
      // Gated on `rendered` state rather than a ref-based "already
      // started" flag: a ref survives React 18 Strict Mode's dev-only
      // double-invoke of this effect, which runs this effect, its
      // cleanup, then this effect again before the first render's promise
      // even resolves — a ref-gate gets set permanently by attempt #1 and
      // then that attempt's own `cancelled` closure discards its result,
      // so nothing ever renders. Gating on `rendered` means a redundant
      // attempt can fire in that dev-only case, but it still converges
      // (whichever attempt resolves first wins) instead of deadlocking.
      if (!shouldRender || rendered) return
      let cancelled = false

      renderPageToCanvas(pdf, pageNumber)
        .then((canvas) => {
          if (cancelled || !containerRef.current) return
          canvas.className = "absolute inset-0 w-full h-full object-contain"
          containerRef.current.appendChild(canvas)
          setRendered(true)
        })
        .catch(() => {
          // Leave the placeholder up — a single unreadable page shouldn't
          // break the rest of the book.
        })

      return () => {
        cancelled = true
      }
    }, [shouldRender, pdf, pageNumber, rendered])

    return (
      <div
        ref={ref}
        className="relative w-full h-full bg-card overflow-hidden"
        data-density="hard"
      >
        <div ref={containerRef} className="absolute inset-0" />
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card to-muted">
            <span className="text-xs text-muted-foreground/50 font-serif italic">
              {pageNumber} / {pageCount}
            </span>
          </div>
        )}
      </div>
    )
  },
)

PageCanvas.displayName = "PageCanvas"
