import { computeCoverLayout, computeStickerLayout } from "@/lib/sticker-math"
import {
  EXPORT_DPI,
  WATERMARK_FONTS,
  WATERMARK_ROTATION_DEG,
  type Border,
  type Crop,
  type NormalizedLogo,
  type StickerSize,
  type Watermark,
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

/** Renders the watermark as its own transparent PNG the size of the full
 *  sticker — the text repeated in a staggered grid across the whole
 *  surface, diagonal, at low opacity. Drawn first in the PDF, underneath
 *  everything else, so the opaque logo and QR images painted on top of it
 *  are never touched — the QR in particular must always stay pixel-perfect
 *  and scannable. */
function renderWatermarkLayer(size: StickerSize, watermark: Watermark) {
  const text = watermark.text.trim()
  if (!watermark.enabled || !text) return null

  const canvasW = Math.round(size.width * EXPORT_DPI)
  const canvasH = Math.round(size.height * EXPORT_DPI)
  const canvas = document.createElement("canvas")
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  const fontFamily = WATERMARK_FONTS.find((f) => f.id === watermark.font)?.family ?? WATERMARK_FONTS[0].family
  const baseFontSize = Math.min(Math.max(canvasH * 0.14, 18), canvasH * 0.3)
  const fontSize = Math.min(Math.max(baseFontSize * watermark.scale, 8), canvasH * 0.6)

  ctx.save()
  ctx.globalAlpha = watermark.opacity
  ctx.fillStyle = "#000000"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // Grid spacing is derived from the *base* size, not the scaled one, so
  // the word-size slider only changes how big each repeat renders — never
  // how many repeats fit. Only the actual fillText call below uses the
  // user-scaled font size.
  ctx.font = `bold ${baseFontSize}px ${fontFamily}`
  const baseTextWidth = ctx.measureText(text).width
  const stepX = baseTextWidth + baseFontSize * 1.8
  const stepY = baseFontSize * 2.6

  ctx.font = `bold ${fontSize}px ${fontFamily}`

  ctx.translate(canvasW / 2, canvasH / 2)
  ctx.rotate((WATERMARK_ROTATION_DEG * Math.PI) / 180)

  // Tile across a square spanning the canvas diagonal, centered, so full
  // coverage holds regardless of rotation angle.
  const span = Math.hypot(canvasW, canvasH)
  let row = 0
  for (let y = -span / 2; y <= span / 2; y += stepY) {
    const rowOffset = row % 2 === 0 ? 0 : stepX / 2
    for (let x = -span / 2 - rowOffset; x <= span / 2; x += stepX) {
      ctx.fillText(text, x, y)
    }
    row++
  }
  ctx.restore()

  return canvas.toDataURL("image/png")
}

export async function exportStickerPdf({
  logo,
  logoCrop,
  qrDataUrl,
  qrScale,
  size,
  contentGap,
  paddingX,
  paddingY,
  border,
  watermark,
  filename,
}: {
  logo: NormalizedLogo
  logoCrop: Crop
  qrDataUrl: string
  qrScale: number
  size: StickerSize
  contentGap: number
  paddingX: number
  paddingY: number
  border: Border
  watermark: Watermark
  filename: string
}) {
  const { jsPDF } = await import("jspdf")

  const borderWidth = border.enabled ? border.width : 0
  const layout = computeStickerLayout({
    width: size.width,
    height: size.height,
    paddingX,
    paddingY,
    gap: contentGap,
    borderWidth,
  })

  const croppedLogo = await renderCroppedLogo(logo, logoCrop, layout.logoFrame.w / layout.logoFrame.h)
  const watermarkLayer = renderWatermarkLayer(size, watermark)

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [size.width, size.height],
  })

  // Watermark first — everything painted after it is fully opaque and
  // will sit cleanly on top, so it never touches the logo or QR.
  if (watermarkLayer) {
    doc.addImage(watermarkLayer, "PNG", 0, 0, size.width, size.height)
  }

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
