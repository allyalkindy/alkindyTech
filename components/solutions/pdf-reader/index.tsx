"use client"

// PDF Reader — upload a PDF, read it like an actual book with a real
// page-turn animation (react-pageflip), two pages side by side on a wide
// screen and one at a time on a phone.
//
// There is no backend and no object storage: the PDF's raw bytes live
// only in the browser's IndexedDB, under one fixed slot (see storage.ts).
// That's what lets a refresh resume the same book for free, and why
// uploading a new one simply replaces whatever was there before — there's
// nothing to clean up server-side because nothing ever left the browser.

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { UploadCloud, Loader2, FileWarning } from "lucide-react"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { BookReader } from "./book-reader"
import { openPdf, getPageAspectRatio } from "./pdf-engine"
import { loadBook, saveBook, clearBook } from "./storage"
import { MAX_PDF_BYTES } from "./constants"

type Status = "checking" | "empty" | "processing" | "ready" | "error"

interface BookState {
  pdf: PDFDocumentProxy
  pageCount: number
  aspectRatio: number
  fileName: string
  initialPage: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function PdfReader() {
  const [status, setStatus] = useState<Status>("checking")
  const [book, setBook] = useState<BookState | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openAndDescribe = useCallback(async (bytes: ArrayBuffer, fileName: string, initialPage: number) => {
    const pdf = await openPdf(bytes)
    const aspectRatio = await getPageAspectRatio(pdf)
    setBook({ pdf, pageCount: pdf.numPages, aspectRatio, fileName, initialPage })
    setStatus("ready")
  }, [])

  // On mount, see if a book was left here from a previous visit and pick
  // it straight back up — this is the entire "persistence" story, no
  // network request involved.
  useEffect(() => {
    let cancelled = false
    loadBook()
      .then(async (stored) => {
        if (cancelled) return
        if (!stored) {
          setStatus("empty")
          return
        }
        await openAndDescribe(stored.bytes, stored.fileName, stored.lastPage)
      })
      .catch(() => {
        if (!cancelled) setStatus("empty")
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      toast.error("That's not a PDF", { description: "Upload a .pdf file." })
      return
    }
    if (file.size > MAX_PDF_BYTES) {
      toast.error("That PDF's too large", { description: `Keep it under ${formatBytes(MAX_PDF_BYTES)}.` })
      return
    }

    setStatus("processing")
    try {
      const bytes = await file.arrayBuffer()
      // Validate by actually opening it before committing to storage —
      // a corrupt/encrypted file should never overwrite a working book.
      await openAndDescribe(bytes.slice(0), file.name, 0)
      await saveBook(file.name, bytes, 0)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Couldn't read that PDF.")
      setStatus("error")
    }
  }, [openAndDescribe])

  const handleRestart = useCallback(async () => {
    await clearBook().catch(() => {})
    setBook(null)
    setStatus("empty")
  }, [])

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Opening your bookshelf…</p>
      </div>
    )
  }

  if (status === "ready" && book) {
    return (
      <BookReader
        pdf={book.pdf}
        pageCount={book.pageCount}
        aspectRatio={book.aspectRatio}
        fileName={book.fileName}
        initialPage={book.initialPage}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 mb-6">
          <FileWarning className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{errorMessage}</p>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={`flex flex-col items-center justify-center text-center gap-4 rounded-2xl border-2 border-dashed p-16 cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
        }`}
      >
        {status === "processing" ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : (
          <UploadCloud className="w-8 h-8 text-primary" />
        )}
        <div>
          <p className="text-base font-semibold text-foreground">
            {status === "processing" ? "Opening your book…" : "Drag & drop a PDF"}
          </p>
          <p className="text-sm text-muted-foreground mt-1.5">
            or click to browse · up to {formatBytes(MAX_PDF_BYTES)}
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Stays on your device — nothing is uploaded anywhere. It'll be here if you refresh,
        until you open a different book.
      </p>
    </div>
  )
}
