import { computeCoverLayout, computeStickerLayout } from "@/lib/sticker-math"
import {
  EXPORT_DPI,
  STICKER_PADDING_IN,
  type Border,
  type Crop,
  type NormalizedLogo,
  type StickerSize,
} from "./constants"

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Could not load image for export."))
    img.src = src
  })
}

/** Flattens the logo crop (cover + zoom + pan) into a single PNG data URL
 *  sized to match the logo frame's exact aspect ratio, at print resolution. */
async function renderCroppedLogo(logo: NormalizedLogo, crop: Crop, frameAspect: number) {
  const img = await loadImage(logo.dataUrl)
  const canvasH = Math.round(2 * EXPORT_DPI)
  const canvasW = Math.round(canvasH * frameAspect)

  const canvas = document.createElement("canvas")
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported.")

  const layout = computeCoverLayout({
    frameW: canvasW,
    frameH: canvasH,
    imgW: img.naturalWidth || logo.naturalWidth,
    imgH: img.naturalHeight || logo.naturalHeight,
    zoom: crop.zoom,
    offsetXFrac: crop.offsetXFrac,
    offsetYFrac: crop.offsetYFrac,
  })

  ctx.drawImage(img, layout.x, layout.y, layout.drawW, layout.drawH)
  return canvas.toDataURL("image/png")
}

export async function exportStickerPdf({
  logo,
  logoCrop,
  qrDataUrl,
  qrScale,
  size,
  contentGap,
  border,
  filename,
}: {
  logo: NormalizedLogo
  logoCrop: Crop
  qrDataUrl: string
  qrScale: number
  size: StickerSize
  contentGap: number
  border: Border
  filename: string
}) {
  const { jsPDF } = await import("jspdf")

  const borderWidth = border.enabled ? border.width : 0
  const layout = computeStickerLayout({
    width: size.width,
    height: size.height,
    padding: STICKER_PADDING_IN,
    gap: contentGap,
    borderWidth,
  })

  const croppedLogo = await renderCroppedLogo(logo, logoCrop, layout.logoFrame.w / layout.logoFrame.h)

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [size.width, size.height],
  })

  // Logo — fills its frame exactly, per the user's crop
  const { logoFrame } = layout
  doc.addImage(croppedLogo, "PNG", logoFrame.x, logoFrame.y, logoFrame.w, logoFrame.h)

  // Die-cut divider, centered in the gap
  doc.setDrawColor(205, 194, 178)
  doc.setLineWidth(0.008)
  doc.setLineDashPattern([0.03, 0.03], 0)
  doc.line(layout.dividerX, layout.contentTop * 0.6, layout.dividerX, size.height - layout.contentTop * 0.6)
  doc.setLineDashPattern([], 0)

  // QR — square, centered in its frame, sized by qrScale
  const { qrFrame } = layout
  const qrMax = Math.min(qrFrame.w, qrFrame.h)
  const qrSize = qrMax * qrScale
  const qrX = qrFrame.x + (qrFrame.w - qrSize) / 2
  const qrY = qrFrame.y + (qrFrame.h - qrSize) / 2
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize)

  // Optional border, stroked fully inside the page bounds
  if (border.enabled && border.width > 0) {
    const rgb = hexToRgb(border.color)
    doc.setDrawColor(rgb.r, rgb.g, rgb.b)
    doc.setLineWidth(border.width)
    const half = border.width / 2
    doc.rect(half, half, size.width - border.width, size.height - border.width, "S")
  }

  doc.save(filename)
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return { r: 0, g: 0, b: 0 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}
