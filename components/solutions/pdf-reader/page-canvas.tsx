"use client"

// One page inside the book. react-pageflip needs a real DOM node for every
// page up front (it animates adjacent pages during a turn), but actually
// rasterizing every page of a long PDF at once would be slow and memory-
// heavy. So every page slot exists immediately, but only renders its real
// bitmap once it's within `shouldRender`'s window around the current page
// — everything else shows a plain placeholder until the reader gets close.
import { forwardRef, memo, useEffect, useRef, useState } from "react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { renderPageToCanvas } from "./pdf-engine"

interface PageCanvasProps {
  pdf: PDFDocumentProxy
  pageNumber: number
  pageCount: number
  shouldRender: boolean
}

const PageCanvasImpl = forwardRef<HTMLDivElement, PageCanvasProps>(
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

    // Once a page drifts outside the render window, free its canvas
    // instead of leaving it mounted forever — react-pageflip keeps every
    // page's wrapper div in the DOM for its own layout needs, but there's
    // no reason to also keep holding onto every bitmap a long book's
    // reader has ever scrolled past. It re-rasterizes quickly (it's just
    // a canvas draw, not a network fetch) if the reader comes back.
    useEffect(() => {
      if (shouldRender || !rendered) return
      containerRef.current?.replaceChildren()
      setRendered(false)
    }, [shouldRender, rendered])

    return (
      // No data-density here on purpose: page-flip reads this attribute per
      // page and defaults to "soft" when absent, which is what actually
      // lets a page bend/curl realistically while dragging. "hard" pages
      // flip as a single rigid rotation with no curve at all — react-
      // pageflip's showCover prop already marks the true first/last pages
      // hard on its own (like a stiff cover), so every inner page here
      // should stay soft to get the realistic paper bend the rest of the
      // time.
      <div ref={ref} className="relative w-full h-full bg-card overflow-hidden">
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

PageCanvasImpl.displayName = "PageCanvas"

// Memoized because react-pageflip needs every page mounted at once — a
// single page flip (or a zoom/fullscreen change) re-renders BookReader,
// and without this every one of those (up to pageCount) PageCanvas
// instances would re-render too even though only a couple actually have
// a changed `shouldRender`. That cost scales with the book's length and,
// once zoom tracks a live pinch gesture, with render frequency as well.
export const PageCanvas = memo(PageCanvasImpl)
