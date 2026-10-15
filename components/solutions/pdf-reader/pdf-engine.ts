// Thin wrapper around pdfjs-dist: opens a PDF from raw bytes and renders
// individual pages to a canvas on demand.
//
// We load the worker script from unpkg at the exact installed version
// (same pattern this app already uses for ffmpeg-core in the MP3-to-MP4
// tool) rather than bundling it — pdfjs's worker has historically been
// awkward to wire through Next.js's bundler, and pinning a CDN URL to the
// exact version we tested against sidesteps that entirely.
import type { PDFDocumentProxy } from "pdfjs-dist"

const PDFJS_VERSION = "6.4.299"
const WORKER_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`

let workerConfigured = false

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist")
  if (!workerConfigured) {
    pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL
    workerConfigured = true
  }
  return pdfjs
}

export async function openPdf(bytes: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfjs()
  // pdfjs detaches/transfers the buffer it's given, so hand it a copy —
  // the caller (e.g. IndexedDB) may still need the original bytes.
  const copy = bytes.slice(0)
  const task = pdfjs.getDocument({ data: copy })
  return task.promise
}

// Renders one page to a freshly-created canvas at a resolution targeting
// ~1600px on the page's longer side — sharp on retina displays without
// rendering at an excessive, memory-hungry resolution for every page of a
// long book.
export async function renderPageToCanvas(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  targetLongSidePx = 1600,
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNumber)
  const base = page.getViewport({ scale: 1 })
  const longSide = Math.max(base.width, base.height)
  const scale = targetLongSidePx / longSide
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D context unavailable")

  await page.render({ canvas, canvasContext: ctx, viewport }).promise
  return canvas
}

// The aspect ratio of page 1, used to size the whole book sensibly instead
// of assuming a fixed paper size — a PDF could be a tall novel, a square
// zine, or a wide landscape deck.
export async function getPageAspectRatio(pdf: PDFDocumentProxy): Promise<number> {
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 1 })
  return viewport.width / viewport.height
}
