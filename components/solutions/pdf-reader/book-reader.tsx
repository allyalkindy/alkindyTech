"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import HTMLFlipBook from "react-pageflip"
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen } from "lucide-react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { PageCanvas } from "./page-canvas"
import { renderPageToCanvas } from "./pdf-engine"
import { saveLastPage } from "./storage"
import { MIN_PAGE_WIDTH, MAX_PAGE_WIDTH, RENDER_WINDOW_BEHIND, RENDER_WINDOW_AHEAD } from "./constants"

interface BookReaderProps {
  pdf: PDFDocumentProxy
  pageCount: number
  aspectRatio: number
  fileName: string
  initialPage: number
  onRestart: () => void
}

// react-pageflip ships its own (unofficial but real) .d.ts, which types
// the ref as `any` — there's nothing more specific to reach for here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlipBookHandle = any

export function BookReader({ pdf, pageCount, aspectRatio, fileName, initialPage, onRestart }: BookReaderProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const bookRef = useRef<FlipBookHandle>(null)

  // Render just the cover (page 1) up front for the closed-book tile —
  // the rest of the pages stay lazy, handled by PageCanvas once opened.
  useEffect(() => {
    let cancelled = false
    renderPageToCanvas(pdf, 1, 900).then((canvas) => {
      if (cancelled) return
      canvas.toBlob((blob) => {
        if (!blob || cancelled) return
        setCoverUrl(URL.createObjectURL(blob))
      }, "image/jpeg", 0.85)
    })
    return () => {
      cancelled = true
    }
  }, [pdf])

  useEffect(() => {
    return () => {
      if (coverUrl) URL.revokeObjectURL(coverUrl)
    }
  }, [coverUrl])

  const handleFlip = (e: { data: number }) => {
    setCurrentPage(e.data)
    saveLastPage(e.data).catch(() => {})
  }

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev()
  const goNext = () => bookRef.current?.pageFlip()?.flipNext()

  useEffect(() => {
    if (!isOpened) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpened])

  // A single page's box, sized from the PDF's own aspect ratio rather than
  // assuming a fixed paper size — react-pageflip doubles this width
  // automatically once there's room to show two pages side by side.
  const pageHeight = Math.round(MAX_PAGE_WIDTH / aspectRatio)

  const progress = pageCount > 1 ? currentPage / (pageCount - 1) : 0

  return (
    <div className="w-full flex flex-col items-center scroll-mt-28">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="cover"
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-6 py-10"
          >
            <motion.button
              type="button"
              aria-label="Open book"
              onClick={() => setIsOpened(true)}
              initial={{ rotateY: -8, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ rotateY: -6, y: -4 }}
              style={{ perspective: 1200, transformStyle: "preserve-3d" }}
              className="group relative"
            >
              <div
                className="relative rounded-r-md rounded-l-sm overflow-hidden border border-border/60"
                style={{
                  width: MAX_PAGE_WIDTH * 0.75,
                  height: (MAX_PAGE_WIDTH * 0.75) / aspectRatio,
                  boxShadow: "-10px 14px 32px rgba(30,20,10,0.28), -2px 0 0 rgba(0,0,0,0.15) inset",
                }}
              >
                {/* Spine shading — the dark gradient down the left edge is what
                    sells "closed book" rather than "a photo of a page." */}
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent z-10" />
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt={fileName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-card to-muted animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-background text-xs font-semibold truncate drop-shadow">{fileName}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <span className="flex items-center gap-2 text-background text-sm font-semibold bg-black/40 rounded-full px-4 py-2">
                    <BookOpen className="w-4 h-4" />
                    Open book
                  </span>
                </div>
              </div>
            </motion.button>
            <p className="text-sm text-muted-foreground">Tap the book to start reading</p>
          </motion.div>
        ) : (
          <motion.div
            key="book"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full flex flex-col items-center gap-5"
          >
            <div className="w-full flex items-center justify-between max-w-3xl px-1">
              <p className="text-sm font-semibold text-foreground truncate max-w-[60%]">{fileName}</p>
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Upload a different book
              </button>
            </div>

            <div
              className="w-full max-w-4xl flex justify-center drop-shadow-[0_25px_50px_rgba(30,20,10,0.25)]"
              style={{ touchAction: "none" }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={MAX_PAGE_WIDTH}
                height={pageHeight}
                size="stretch"
                minWidth={MIN_PAGE_WIDTH}
                maxWidth={MAX_PAGE_WIDTH}
                minHeight={Math.round(MIN_PAGE_WIDTH / aspectRatio)}
                maxHeight={pageHeight}
                startPage={initialPage}
                drawShadow
                flippingTime={700}
                usePortrait
                startZIndex={10}
                autoSize
                maxShadowOpacity={0.4}
                showCover
                mobileScrollSupport={false}
                swipeDistance={20}
                clickEventForward
                useMouseEvents
                showPageCorners
                disableFlipByClick={false}
                className="pdf-flipbook"
                style={{}}
                onFlip={handleFlip}
              >
                {Array.from({ length: pageCount }, (_, i) => {
                  const pageNumber = i + 1
                  const shouldRender =
                    pageNumber >= currentPage + 1 - RENDER_WINDOW_BEHIND &&
                    pageNumber <= currentPage + 1 + RENDER_WINDOW_AHEAD
                  return (
                    <PageCanvas
                      key={pageNumber}
                      pdf={pdf}
                      pageNumber={pageNumber}
                      pageCount={pageCount}
                      shouldRender={shouldRender}
                    />
                  )
                })}
              </HTMLFlipBook>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentPage <= 0}
                aria-label="Previous page"
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center gap-1.5 w-48">
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  Page {currentPage + 1} of {pageCount}
                </span>
                <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={currentPage >= pageCount - 1}
                aria-label="Next page"
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
