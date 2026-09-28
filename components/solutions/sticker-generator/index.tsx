"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { toast } from "sonner"
import { UploadCloud, Link as LinkIcon, X, Download, Loader2 } from "lucide-react"
import { StickerPreview } from "./sticker-preview"
import { exportStickerPdf } from "./pdf-export"
import {
  DEFAULT_BORDER,
  DEFAULT_CONTENT_GAP_IN,
  DEFAULT_CROP,
  DEFAULT_QR_COLOR,
  DEFAULT_STICKER_SIZE,
  MAX_FILE_BYTES,
  MAX_QR_SCALE,
  type Border,
  type Crop,
  type NormalizedLogo,
  type StickerSize,
} from "./constants"

function slugFromLink(url: string) {
  try {
    const withScheme = /^https?:\/\//i.test(url) ? url : `https://${url}`
    const { hostname } = new URL(withScheme)
    const slug = hostname
      .replace(/^www\./, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/(^-|-$)/g, "")
      .toLowerCase()
    return slug || "sticker"
  } catch {
    return "sticker"
  }
}

function fileToNormalizedLogo(file: File): Promise<NormalizedLogo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Could not read that file."))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error("That file doesn't look like a valid image."))
      img.onload = () => {
        const maxDim = 1200
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Your browser can't process images here."))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        resolve({ dataUrl: canvas.toDataURL("image/png"), naturalWidth: w, naturalHeight: h, name: file.name })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function StickerGenerator() {
  const [logo, setLogo] = useState<NormalizedLogo | null>(null)
  const [logoCrop, setLogoCrop] = useState<Crop>(DEFAULT_CROP)
  const [isProcessingLogo, setIsProcessingLogo] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [link, setLink] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrScale, setQrScale] = useState(MAX_QR_SCALE)
  const [qrColor, setQrColor] = useState(DEFAULT_QR_COLOR)
  const [stickerSize, setStickerSize] = useState<StickerSize>(DEFAULT_STICKER_SIZE)
  const [contentGap, setContentGap] = useState(DEFAULT_CONTENT_GAP_IN)
  const [border, setBorder] = useState<Border>(DEFAULT_BORDER)
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("That's not an image", { description: "Upload a PNG, JPG, WEBP, or SVG logo." })
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("File's too large", { description: "Keep your logo under 10MB." })
      return
    }
    setIsProcessingLogo(true)
    try {
      const normalized = await fileToNormalizedLogo(file)
      setLogo(normalized)
      setLogoCrop(DEFAULT_CROP)
    } catch (err) {
      toast.error("Couldn't process that logo", {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setIsProcessingLogo(false)
    }
  }, [])

  useEffect(() => {
    const trimmed = link.trim()
    if (!trimmed) {
      setQrDataUrl(null)
      return
    }
    let cancelled = false
    const handle = setTimeout(async () => {
      try {
        const dataUrl = await QRCode.toDataURL(trimmed, {
          width: 600,
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: qrColor, light: "#ffffff" },
        })
        if (!cancelled) setQrDataUrl(dataUrl)
      } catch {
        if (!cancelled) setQrDataUrl(null)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [link, qrColor])

  const handleDownload = async () => {
    if (!logo || !qrDataUrl) {
      toast.error("Almost there", { description: "Add a logo and a link before downloading." })
      return
    }
    setIsGenerating(true)
    try {
      await exportStickerPdf({
        logo,
        logoCrop,
        qrDataUrl,
        qrScale,
        size: stickerSize,
        contentGap,
        border,
        filename: `${slugFromLink(link)}-sticker.pdf`,
      })
      toast.success("Sticker downloaded", {
        description: `Print-ready PDF, ${stickerSize.width}″ × ${stickerSize.height}″.`,
      })
    } catch {
      toast.error("Something went wrong generating the PDF. Try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const canDownload = Boolean(logo && qrDataUrl) && !isGenerating

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      {/* Controls */}
      <div className="space-y-8">
        {/* Step 1 — Logo */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
              1
            </span>
            <h2 className="font-serif text-xl text-foreground">Upload your logo</h2>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {logo ? (
            <div className="relative flex items-center gap-4 border border-border rounded-2xl p-4 bg-card">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.dataUrl} alt="Uploaded logo preview" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{logo.name}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Replace
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLogo(null)
                  setLogoCrop(DEFAULT_CROP)
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                aria-label="Remove logo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
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
              className={`flex flex-col items-center justify-center text-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              {isProcessingLogo ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6 text-primary" />
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isProcessingLogo ? "Processing…" : "Drag & drop your logo"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse · PNG, JPG, SVG up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — Link */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
              2
            </span>
            <h2 className="font-serif text-xl text-foreground">Paste your link</h2>
          </div>
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            The QR code updates automatically as you type.
          </p>
        </div>

        {/* Step 3 — Download */}
        <div className="pt-2">
          <button
            onClick={handleDownload}
            disabled={!canDownload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isGenerating ? "Preparing PDF…" : "Download Sticker PDF"}
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            Everything happens in your browser — nothing is uploaded anywhere.
          </p>
        </div>
      </div>

      {/* Live preview + on-preview controls */}
      <div className="lg:sticky lg:top-28">
        <StickerPreview
          logo={logo}
          logoCrop={logoCrop}
          onLogoCropChange={setLogoCrop}
          qrDataUrl={qrDataUrl}
          qrScale={qrScale}
          onQrScaleChange={setQrScale}
          qrColor={qrColor}
          onQrColorChange={setQrColor}
          size={stickerSize}
          onSizeChange={setStickerSize}
          contentGap={contentGap}
          onContentGapChange={setContentGap}
          border={border}
          onBorderChange={setBorder}
        />
      </div>
    </div>
  )
}
