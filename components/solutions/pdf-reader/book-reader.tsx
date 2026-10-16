"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import HTMLFlipBook from "react-pageflip"
import { RotateCcw, BookOpen, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { PageCanvas } from "./page-canvas"
import { renderPageToCanvas } from "./pdf-engine"
import { saveLastPage } from "./storage"
import {
  MIN_PAGE_WIDTH,
  MAX_PAGE_WIDTH,
  RENDER_WINDOW_BEHIND,
  RENDER_WINDOW_AHEAD,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from "./constants"

interface BookReaderProps {
  pdf: PDFDocumentProxy
  pageCount: number
  aspectRatio: number
  fileName: string
  initialPage: number
  onRestart: () => void
  // Lets the page shell (hero text, step cards) collapse out of the way
  // once the user actually starts reading, giving the book the room.
  onOpenChange?: (isOpened: boolean) => void
}

// react-pageflip ships its own (unofficial but real) .d.ts, which types
// the ref as `any` — there's nothing more specific to reach for here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlipBookHandle = any

export function BookReader({
  pdf,
  pageCount,
  aspectRatio,
  fileName,
  initialPage,
  onRestart,
  onOpenChange,
}: BookReaderProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [zoom, setZoom] = useState(1)
  // "native" = real OS-level fullscreen via the Fullscreen API. "pseudo" =
  // the CSS fallback (fixed, fills the browser viewport) for browsers that
  // don't support requestFullscreen on an arbitrary element — notably
  // Safari on iPhone (it works on iPad, just not the phone).
  const [fullscreenMode, setFullscreenMode] = useState<"off" | "native" | "pseudo">("off")
  // Measured, not guessed: how much space is actually left for the book
  // after the top/bottom bars take their share. A formula-based estimate
  // (e.g. deriving height from a fixed width and the PDF's aspect ratio)
  // was consistently landing a few pixels taller than what was really
  // available, which is exactly what forced a scrollbar even at 100% zoom.
  const [bookAreaSize, setBookAreaSize] = useState<{ width: number; height: number } | null>(null)
  const bookRef = useRef<FlipBookHandle>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bookAreaObserverRef = useRef<ResizeObserver | null>(null)

  const openBook = () => {
    setIsOpened(true)
    onOpenChange?.(true)
  }

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100))
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100))
  const zoomReset = () => setZoom(1)

  // A callback ref rather than useRef + useEffect: the book view (and this
  // div) only mounts once AnimatePresence finishes animating the cover out
  // (mode="wait"), which happens after React's own isOpened state change —
  // a useEffect keyed on isOpened fires the instant that state changes,
  // which is still before that delayed mount, so it only ever finds a null
  // ref. A callback ref instead fires exactly when React actually attaches
  // (or detaches) the DOM node, whenever that really happens.
  const setBookAreaRef = useCallback((el: HTMLDivElement | null) => {
    bookAreaObserverRef.current?.disconnect()
    bookAreaObserverRef.current = null
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setBookAreaSize({ width, height })
    })
    observer.observe(el)
    bookAreaObserverRef.current = observer
  }, [])

  // Keeps fullscreenMode in sync when fullscreen ends via something other
  // than our own button — the browser's own exit control, or the Esc key.
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenMode((mode) => (mode === "native" ? "off" : mode))
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    if (fullscreenMode !== "off") {
      if (fullscreenMode === "native" && document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {})
      }
      setFullscreenMode("off")
      return
    }

    const el = containerRef.current
    if (el?.requestFullscreen) {
      try {
        await el.requestFullscreen()
        setFullscreenMode("native")
        return
      } catch {
        // Falls through to the CSS fallback below — some browsers (and
        // some contexts, like not having a trusted user gesture) reject
        // requestFullscreen even when the method exists.
      }
    }
    // No Fullscreen API at all (iPhone Safari) or the native request
    // failed: fall back to a fixed overlay that fills the browser's own
    // viewport instead of the whole device screen.
    setFullscreenMode("pseudo")
  }

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

  // The underlying page-flip library only treats a touch gesture as a
  // light "swipe" (instant flip, no need to drag near the page's edge) if
  // it finishes within a hardcoded 250ms — that's not exposed as a
  // setting, and a natural, unhurried flick on a real phone easily takes
  // longer than that. Anything slower falls through to its real-drag
  // logic, which only completes the flip once you've dragged the page
  // more than halfway across — i.e. "hold it almost to the end." This
  // fills exactly that gap: a touch that moved like a deliberate flick but
  // missed the library's own fast-swipe window still turns the page,
  // without needing a long drag. It only acts in that gap (>250ms) so it
  // can never double-fire alongside the library's own instant swipe. It
  // only applies at 100% zoom — once zoomed in, a one-finger drag pans the
  // enlarged page instead (native scrolling handles that on its own).
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  // Two-finger pinch-to-zoom, tracked separately from the one-finger flick
  // above so both can share the same touch handlers without conflicting.
  // Reuses the exact same `zoom` state (and its MIN_ZOOM/MAX_ZOOM clamp)
  // as the +/- buttons and keyboard shortcuts, just driven continuously
  // instead of in ZOOM_STEP increments, so it stays in sync with them.
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null)
  const [isPinching, setIsPinching] = useState(false)

  const touchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.hypot(dx, dy)
  }

  const endPinch = () => {
    pinchRef.current = null
    setIsPinching(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      touchStartRef.current = null
      pinchRef.current = { distance: touchDistance(e.touches), zoom }
      setIsPinching(true)
      return
    }
    const t = e.touches[0]
    if (!t || zoom !== 1) return
    touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchRef.current) return
    const scale = touchDistance(e.touches) / pinchRef.current.distance
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchRef.current.zoom * scale))
    setZoom(Math.round(next * 100) / 100)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2 && pinchRef.current) endPinch()
    if (e.touches.length > 0) return

    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return

    const t = e.changedTouches[0]
    if (!t) return
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    const elapsed = Date.now() - start.time

    const missedNativeSwipeWindow = elapsed >= 260 && elapsed < 650
    const movedLikeAFlick = Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.5

    if (missedNativeSwipeWindow && movedLikeAFlick) {
      if (dx < 0) goNext()
      else goPrev()
    }
  }

  useEffect(() => {
    if (!isOpened) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "+" || e.key === "=") zoomIn()
      if (e.key === "-" || e.key === "_") zoomOut()
      if (e.key === "0") zoomReset()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpened])

  // A single page's box, sized from the PDF's own aspect ratio rather than
  // assuming a fixed paper size — react-pageflip doubles this width
  // automatically once there's room to show two pages side by side.
  const pageHeight = Math.round(MAX_PAGE_WIDTH / aspectRatio)

  // react-pageflip's "stretch" sizing turned out to only strictly respect
  // maxWidth — given maxWidth and maxHeight as two independent bounds, it
  // consistently rendered ~20px taller than maxHeight whenever the
  // width-driven size (maxWidth scaled by the page's aspect ratio) came
  // out taller than maxHeight, rather than backing width off to compensate.
  // So instead of handing it two numbers it might reconcile inconsistently,
  // this pre-shrinks width so that the height IT would derive from that
  // width already fits — maxWidth and maxHeight end up redundant (both
  // equal to this same fitted pair), leaving the library nothing to
  // reconcile.
  function fitSinglePage(maxW: number, maxH: number) {
    const widthIfHeightBound = Math.floor(maxH * aspectRatio)
    if (widthIfHeightBound <= maxW) return { width: widthIfHeightBound, height: maxH }
    return { width: maxW, height: Math.floor(maxW / aspectRatio) }
  }

  // In fullscreen, the book's container itself grows to fill the screen
  // (native fullscreen or the CSS fallback below) — this raises the
  // ceiling react-pageflip's own "stretch" sizing is allowed to grow to.
  // Once bookAreaSize has reported a real measurement, fit against that
  // directly (minus a couple px of safety margin) instead of a formula-
  // based guess. Before the first measurement arrives, fall back to a
  // rough estimate so there's no flash of zero-sized content.
  //
  // This measurement-based path only applies in fullscreen, where the
  // scroll container's height is independently driven by the viewport
  // (flex-1/h-full). Inline mode has no such independent height — the
  // container sizes to its own content (the book), so feeding a
  // bookAreaSize measurement back into the book's own size creates a
  // circular dependency: a transient small/zero measurement gets locked
  // in via the remount key, collapsing the book to zero height. Inline
  // mode instead keeps the original fixed-constant sizing, which never
  // had this problem.
  const isFullscreen = fullscreenMode !== "off"
  const fitted = isFullscreen
    ? bookAreaSize
      ? fitSinglePage(Math.floor(bookAreaSize.width) - 2, Math.floor(bookAreaSize.height) - 2)
      : fitSinglePage(1600, Math.round(1600 / aspectRatio))
    : { width: MAX_PAGE_WIDTH, height: pageHeight }
  const effectiveMaxWidth = fitted.width
  const effectiveMaxHeight = fitted.height

  const progress = pageCount > 1 ? currentPage / (pageCount - 1) : 0

  // Memoized so this (and the PageCanvas elements inside it) stays
  // referentially stable across renders that don't actually change which
  // pages should be rendered — zoom changes (especially the continuous
  // stream of them during a pinch gesture) and fullscreen toggles both
  // re-render BookReader without touching pdf/pageCount/currentPage, and
  // without this, every one of those renders would rebuild a fresh
  // pageCount-length array and element list for react-pageflip to
  // reconcile from scratch.
  const pages = useMemo(
    () =>
      Array.from({ length: pageCount }, (_, i) => {
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
      }),
    [pdf, pageCount, currentPage],
  )

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
              onClick={openBook}
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
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={
              fullscreenMode === "off"
                ? "w-full flex flex-col items-center gap-5"
                : // "native": the Fullscreen API already makes this element
                  // fill the screen — this just gives it a background and a
                  // column layout. "pseudo": there's no native fullscreen
                  // happening, so this does the filling itself (fixed,
                  // covering the browser's viewport). min-h-0 on this flex
                  // column (and on the book slot below) is what lets the
                  // book shrink to the space actually left over instead of
                  // pushing past the screen's edge — without it a flex
                  // column defaults to never shrinking below its content's
                  // natural size, which is exactly what was forcing a
                  // scrollbar even at 100% zoom.
                  `w-full h-full min-h-0 flex flex-col items-center gap-1 bg-background p-1 ${
                    fullscreenMode === "pseudo" ? "fixed inset-0 z-50" : ""
                  }`
            }
          >
            <div
              className={`w-full shrink-0 flex flex-wrap items-center justify-between gap-3 px-1 ${
                isFullscreen ? "max-w-[1700px]" : "max-w-4xl"
              }`}
            >
              <p className="text-sm font-semibold text-foreground truncate max-w-[50%]">{fileName}</p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-0.5 rounded-full border border-border bg-card p-1">
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoom <= MIN_ZOOM}
                    aria-label="Zoom out"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={zoomReset}
                    aria-label="Reset zoom"
                    className="px-2 text-xs font-semibold text-muted-foreground hover:text-foreground tabular-nums min-w-[3.25rem] transition-colors"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoom >= MAX_ZOOM}
                    aria-label="Zoom in"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onRestart}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload a different book</span>
                </button>
              </div>
            </div>

            {/* overflow-auto + the inner scale transform is what makes zoom
                work: react-pageflip keeps computing its own drag/flip
                geometry off the real (unscaled) DOM rect, so transform-
                scaling it visually afterward never throws that math off —
                it just makes the rendered result bigger, and this wrapper
                lets the user pan around whatever now overflows it.
                no-scrollbar keeps that panning functional without the
                scrollbar itself being visible. In fullscreen, flex-1
                min-h-0 is what makes this section (rather than the whole
                screen) the one that takes exactly the leftover space
                between the top and bottom bars — min-h-0 specifically is
                needed because a flex child's default min-height is "auto"
                (its content size), which is what was letting the book push
                past the bottom of the screen instead of fitting inside it. */}
            <div
              ref={setBookAreaRef}
              className={`w-full overflow-auto no-scrollbar rounded-xl flex items-center justify-center ${
                isFullscreen ? "max-w-[1700px] flex-1 min-h-0" : "max-w-4xl"
              }`}
              style={!isFullscreen ? { maxHeight: zoom > 1 ? effectiveMaxHeight + 32 : undefined } : undefined}
            >
              <div
                className="shrink-0 flex justify-center drop-shadow-[0_25px_50px_rgba(30,20,10,0.25)]"
                // Flick-to-flip (one finger) only fires at 100% zoom, see
                // handleTouchStart. Pinch-to-zoom (two fingers) works at
                // any zoom level so a pinch can zoom back out again too.
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => {
                  touchStartRef.current = null
                  endPinch()
                }}
                style={{
                  touchAction: zoom > 1 ? "pan-x pan-y" : "none",
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                  // No transition while actively pinching — a CSS easing
                  // transition on a value already being updated every
                  // touchmove frame just makes the zoom visibly lag behind
                  // the fingers. Button/keyboard zoom changes (discrete,
                  // not continuous) still get the smooth animated snap.
                  transition: isPinching ? "none" : "transform 0.2s ease",
                  width: "100%",
                }}
              >
              <HTMLFlipBook
                // react-pageflip's "stretch" sizing only establishes itself
                // once, at mount — it doesn't re-measure when maxWidth/
                // maxHeight props change afterward (which is exactly what
                // happens here: the real measured bookAreaSize always
                // arrives a render or two after the first mount, so without
                // this the book would be stuck using the rough pre-
                // measurement fallback size forever). Keying on the target
                // size forces a clean remount whenever it meaningfully
                // changes, so the engine always initializes with the real,
                // final bounds. Bucketed to whole 10px steps so it doesn't
                // remount on every sub-pixel ResizeObserver tick, and
                // startPage uses currentPage (not the original initialPage)
                // so a remount resumes wherever the user actually is rather
                // than jumping back to the start.
                key={`${fullscreenMode}-${Math.round(effectiveMaxWidth / 10)}-${Math.round(effectiveMaxHeight / 10)}`}
                ref={bookRef}
                width={effectiveMaxWidth}
                height={effectiveMaxHeight}
                size="stretch"
                minWidth={MIN_PAGE_WIDTH}
                maxWidth={effectiveMaxWidth}
                minHeight={Math.round(MIN_PAGE_WIDTH / aspectRatio)}
                maxHeight={effectiveMaxHeight}
                startPage={currentPage}
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
                {pages}
              </HTMLFlipBook>
              </div>
            </div>

            {/* No prev/next buttons by design — the book itself is the
                control. Clicking/tapping a page corner (react-pageflip's
                own built-in behavior) turns it, same as the keyboard arrows
                and the touch-flick handler above. This keeps every pixel
                not strictly needed for chrome going to the book instead. */}
            <div className="shrink-0 flex flex-col items-center gap-1.5 w-48">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
