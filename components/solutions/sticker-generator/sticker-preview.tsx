"use client"

import { useRef } from "react"
import { ImageIcon, QrCode as QrCodeIcon, Move, Maximize2, Pipette, Square, Stamp } from "lucide-react"
import { computeCoverLayout, computeStickerLayout, clamp, isLowContrastForScanning } from "@/lib/sticker-math"
import { useElementSize } from "./use-element-size"
import {
  COLOR_PRESETS,
  MAX_BORDER_WIDTH_IN,
  MAX_CONTENT_GAP_IN,
  MAX_LOGO_ZOOM,
  MAX_QR_SCALE,
  MAX_STICKER_WIDTH,
  MAX_WATERMARK_OPACITY,
  MAX_WATERMARK_SCALE,
  MAX_WATERMARK_TEXT_LENGTH,
  MIN_BORDER_WIDTH_IN,
  MIN_CONTENT_GAP_IN,
  MIN_LOGO_ZOOM,
  MIN_QR_SCALE,
  MIN_STICKER_HEIGHT,
  MIN_STICKER_WIDTH,
  MIN_WATERMARK_OPACITY,
  MIN_WATERMARK_SCALE,
  MIN_WIDTH_HEIGHT_GAP,
  MAX_STICKER_HEIGHT,
  MIN_PADDING_IN,
  MAX_PADDING_IN,
  SIZE_PRESETS,
  WATERMARK_FONTS,
  WATERMARK_ROTATION_DEG,
  type Border,
  type Crop,
  type NormalizedLogo,
  type ResizeHandle,
  type StickerSize,
  type Watermark,
} from "./constants"

interface StickerPreviewProps {
  logo: NormalizedLogo | null
  logoCrop: Crop
  onLogoCropChange: (crop: Crop) => void
  qrDataUrl: string | null
  qrScale: number
  onQrScaleChange: (scale: number) => void
  qrColor: string
  onQrColorChange: (color: string) => void
  size: StickerSize
  onSizeChange: (size: StickerSize) => void
  contentGap: number
  onContentGapChange: (gap: number) => void
  paddingX: number
  onPaddingXChange: (padding: number) => void
  paddingY: number
  onPaddingYChange: (padding: number) => void
  border: Border
  onBorderChange: (border: Border) => void
  watermark: Watermark
  onWatermarkChange: (watermark: Watermark) => void
}

const HANDLE_CONFIG: Record<
  ResizeHandle,
  { widthSign: -1 | 0 | 1; heightSign: -1 | 0 | 1; cursor: string; position: string }
> = {
  nw: { widthSign: -1, heightSign: -1, cursor: "cursor-nwse-resize", position: "-top-1 -left-1" },
  n: { widthSign: 0, heightSign: -1, cursor: "cursor-ns-resize", position: "-top-1 left-1/2 -translate-x-1/2" },
  ne: { widthSign: 1, heightSign: -1, cursor: "cursor-nesw-resize", position: "-top-1 -right-1" },
  e: { widthSign: 1, heightSign: 0, cursor: "cursor-ew-resize", position: "top-1/2 -right-1 -translate-y-1/2" },
  se: { widthSign: 1, heightSign: 1, cursor: "cursor-nwse-resize", position: "-bottom-1 -right-1" },
  s: { widthSign: 0, heightSign: 1, cursor: "cursor-ns-resize", position: "-bottom-1 left-1/2 -translate-x-1/2" },
  sw: { widthSign: -1, heightSign: 1, cursor: "cursor-nesw-resize", position: "-bottom-1 -left-1" },
  w: { widthSign: -1, heightSign: 0, cursor: "cursor-ew-resize", position: "top-1/2 -left-1 -translate-y-1/2" },
}

export function StickerPreview({
  logo,
  logoCrop,
  onLogoCropChange,
  qrDataUrl,
  qrScale,
  onQrScaleChange,
  qrColor,
  onQrColorChange,
  size,
  onSizeChange,
  contentGap,
  onContentGapChange,
  paddingX,
  onPaddingXChange,
  paddingY,
  onPaddingYChange,
  border,
  onBorderChange,
  watermark,
  onWatermarkChange,
}: StickerPreviewProps) {
  const { ref: stickerFrameRef, size: stickerFrameSize } = useElementSize<HTMLDivElement>()

  const dragState = useRef<{
    startX: number
    startY: number
    startOffsetX: number
    startOffsetY: number
  } | null>(null)

  const resizeState = useRef<{
    handle: ResizeHandle
    startX: number
    startY: number
    startWidth: number
    startHeight: number
    pxPerInchX: number
    pxPerInchY: number
  } | null>(null)

  const pxPerInch = stickerFrameSize.width ? stickerFrameSize.width / size.width : 0
  const borderPx = border.enabled ? border.width * pxPerInch : 0
  const layout = computeStickerLayout({
    width: stickerFrameSize.width,
    height: stickerFrameSize.height,
    paddingX: paddingX * pxPerInch,
    paddingY: paddingY * pxPerInch,
    gap: contentGap * pxPerInch,
    borderWidth: borderPx,
  })

  const watermarkText = watermark.text.trim()
  const watermarkFamily = WATERMARK_FONTS.find((f) => f.id === watermark.font)?.family ?? WATERMARK_FONTS[0].family
  const watermarkTile = (() => {
    if (!stickerFrameSize.height || !watermarkText) return null
    const baseFontSize = Math.min(Math.max(stickerFrameSize.height * 0.14, 12), stickerFrameSize.height * 0.3)
    const fontSize = Math.min(Math.max(baseFontSize * watermark.scale, 8), stickerFrameSize.height * 0.6)
    const estCharWidth = 0.58
    // Tile size (and therefore how many repeats fit) is derived from the
    // *base* font size, not the scaled one — the word-size slider only
    // changes how big each repeat renders inside its fixed slot, never how
    // many slots there are.
    const baseTextWidth = watermarkText.length * baseFontSize * estCharWidth
    const tileW = baseTextWidth + baseFontSize * 1.8
    const tileH = baseFontSize * 2.6
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" overflow="visible">` +
      `<text x="${tileW / 2}" y="${tileH / 2}" font-family="${escapeXml(watermarkFamily)}" ` +
      `font-size="${fontSize}" font-weight="700" fill="#000000" fill-opacity="${watermark.opacity}" ` +
      `text-anchor="middle" dominant-baseline="middle" ` +
      `transform="rotate(${WATERMARK_ROTATION_DEG} ${tileW / 2} ${tileH / 2})">${escapeXml(watermarkText)}</text>` +
      `</svg>`
    const url = `data:image/svg+xml,${encodeURIComponent(svg)}`
    return { url, tileW, tileH }
  })()

  const logoLayout =
    logo && layout.logoFrame.w > 0
      ? computeCoverLayout({
          frameW: layout.logoFrame.w,
          frameH: layout.logoFrame.h,
          imgW: logo.naturalWidth,
          imgH: logo.naturalHeight,
          zoom: logoCrop.zoom,
          offsetXFrac: logoCrop.offsetXFrac,
          offsetYFrac: logoCrop.offsetYFrac,
        })
      : null

  const handleLogoPointerDown = (e: React.PointerEvent) => {
    if (!logo) return
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: logoCrop.offsetXFrac,
      startOffsetY: logoCrop.offsetYFrac,
    }
  }

  const handleLogoPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || !logo || !layout.logoFrame.w) return
    const base = computeCoverLayout({
      frameW: layout.logoFrame.w,
      frameH: layout.logoFrame.h,
      imgW: logo.naturalWidth,
      imgH: logo.naturalHeight,
      zoom: logoCrop.zoom,
      offsetXFrac: 0,
      offsetYFrac: 0,
    })
    const maxOffsetX = Math.max(0, (base.drawW - layout.logoFrame.w) / 2)
    const maxOffsetY = Math.max(0, (base.drawH - layout.logoFrame.h) / 2)
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    const nextX = maxOffsetX > 0 ? clamp(dragState.current.startOffsetX + dx / maxOffsetX, -1, 1) : 0
    const nextY = maxOffsetY > 0 ? clamp(dragState.current.startOffsetY + dy / maxOffsetY, -1, 1) : 0
    onLogoCropChange({ ...logoCrop, offsetXFrac: nextX, offsetYFrac: nextY })
  }

  const endLogoDrag = () => {
    dragState.current = null
  }

  const startResize = (handle: ResizeHandle) => (e: React.PointerEvent) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    resizeState.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      pxPerInchX: (stickerFrameSize.width || 1) / size.width,
      pxPerInchY: (stickerFrameSize.height || 1) / size.height,
    }
  }

  const moveResize = (e: React.PointerEvent) => {
    if (!resizeState.current) return
    const { handle, startX, startY, startWidth, startHeight, pxPerInchX, pxPerInchY } = resizeState.current
    const cfg = HANDLE_CONFIG[handle]
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    let rawWidth = clamp(startWidth + (cfg.widthSign * dx) / pxPerInchX, MIN_STICKER_WIDTH, MAX_STICKER_WIDTH)
    let rawHeight = clamp(startHeight + (cfg.heightSign * dy) / pxPerInchY, MIN_STICKER_HEIGHT, MAX_STICKER_HEIGHT)
    if (rawWidth - rawHeight < MIN_WIDTH_HEIGHT_GAP) rawHeight = rawWidth - MIN_WIDTH_HEIGHT_GAP
    onSizeChange({ width: Math.round(rawWidth * 20) / 20, height: Math.round(rawHeight * 20) / 20 })
  }

  const endResize = () => {
    resizeState.current = null
  }

  const lowContrast = isLowContrastForScanning(qrColor)

  return (
    <div className="rounded-3xl border border-border bg-muted/40 p-8 sm:p-12 flex flex-col items-center">
      <div className="relative w-full max-w-md select-none">
        <CropMark className="-top-2 -left-2" />
        <CropMark className="-top-2 -right-2 rotate-90" />
        <CropMark className="-bottom-2 -left-2 -rotate-90" />
        <CropMark className="-bottom-2 -right-2 rotate-180" />

        <div
          ref={stickerFrameRef}
          style={{
            aspectRatio: `${size.width} / ${size.height}`,
            boxShadow: border.enabled
              ? `inset 0 0 0 ${borderPx}px ${border.color}, var(--shadow-professional)`
              : undefined,
          }}
          className="w-full rounded-2xl bg-white shadow-professional overflow-hidden relative"
        >
          {stickerFrameSize.width > 0 && (
            <>
              {/* Watermark — repeated in a staggered tile across the whole
                  sticker, painted behind everything else so the opaque
                  logo and QR images on top of it are never affected */}
              {watermark.enabled && watermarkText && watermarkTile && (
                <div
                  className="absolute inset-0 pointer-events-none z-0"
                  style={{
                    backgroundImage: `url("${watermarkTile.url}"), url("${watermarkTile.url}")`,
                    backgroundRepeat: "repeat, repeat",
                    backgroundSize: `${watermarkTile.tileW}px ${watermarkTile.tileH}px, ${watermarkTile.tileW}px ${watermarkTile.tileH}px`,
                    backgroundPosition: `0 0, ${watermarkTile.tileW / 2}px ${watermarkTile.tileH / 2}px`,
                  }}
                />
              )}

              {/* Logo frame — draggable to pan when zoomed */}
              <div
                onPointerDown={handleLogoPointerDown}
                onPointerMove={handleLogoPointerMove}
                onPointerUp={endLogoDrag}
                onPointerCancel={endLogoDrag}
                style={{
                  position: "absolute",
                  left: layout.logoFrame.x,
                  top: layout.logoFrame.y,
                  width: layout.logoFrame.w,
                  height: layout.logoFrame.h,
                }}
                className={`overflow-hidden rounded-lg touch-none flex items-center justify-center ${
                  logo && logoCrop.zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
                }`}
              >
                {logo && logoLayout ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.dataUrl}
                    alt="Logo preview"
                    draggable={false}
                    style={{
                      position: "absolute",
                      left: logoLayout.x,
                      top: logoLayout.y,
                      width: logoLayout.drawW,
                      height: logoLayout.drawH,
                      maxWidth: "none",
                    }}
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
                )}
              </div>

              {/* Die-cut divider, centered in the gap */}
              <div
                style={{
                  position: "absolute",
                  left: layout.dividerX - 0.5,
                  top: layout.contentTop,
                  height: layout.contentBottom - layout.contentTop,
                  width: 1,
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 4px, #d4d4d4 4px, #d4d4d4 8px)",
                }}
              />

              {/* QR frame — scaled by qrScale, centered */}
              <div
                style={{
                  position: "absolute",
                  left: layout.qrFrame.x,
                  top: layout.qrFrame.y,
                  width: layout.qrFrame.w,
                  height: layout.qrFrame.h,
                }}
                className="flex items-center justify-center"
              >
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt="Generated QR code"
                    className="object-contain"
                    style={{ width: `${qrScale * 100}%`, height: `${qrScale * 100}%` }}
                  />
                ) : (
                  <QrCodeIcon className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
                )}
              </div>
            </>
          )}

          {/* Resize handles — drag any edge or corner to crop the sticker */}
          {(Object.keys(HANDLE_CONFIG) as ResizeHandle[]).map((handle) => (
            <div
              key={handle}
              onPointerDown={startResize(handle)}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              role="slider"
              aria-label={`Resize sticker (${handle})`}
              aria-valuenow={size.width}
              className={`absolute w-3.5 h-3.5 rounded-full bg-card border-2 border-foreground/40 hover:border-primary hover:scale-125 transition-transform touch-none z-10 ${HANDLE_CONFIG[handle].position} ${HANDLE_CONFIG[handle].cursor}`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mt-6">
        {size.width.toFixed(2).replace(/\.?0+$/, "")}&Prime; &times; {size.height.toFixed(2).replace(/\.?0+$/, "")}&Prime; · Print-ready PDF
      </p>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 mt-1">
        <Maximize2 className="w-3 h-3" />
        Drag any edge or corner to crop
      </div>

      {/* Companion controls */}
      <div className="w-full max-w-md mt-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {SIZE_PRESETS.map((preset) => {
            const active = Math.abs(preset.width - size.width) < 0.01 && Math.abs(preset.height - size.height) < 0.01
            return (
              <button
                key={`${preset.width}x${preset.height}`}
                onClick={() => onSizeChange(preset)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {preset.width}&Prime; &times; {preset.height}&Prime;
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground">Padding X</label>
              <span className="text-xs text-muted-foreground">{paddingX.toFixed(2)}&Prime;</span>
            </div>
            <input
              type="range"
              min={MIN_PADDING_IN}
              max={MAX_PADDING_IN}
              step={0.01}
              value={paddingX}
              onChange={(e) => onPaddingXChange(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground">Padding Y</label>
              <span className="text-xs text-muted-foreground">{paddingY.toFixed(2)}&Prime;</span>
            </div>
            <input
              type="range"
              min={MIN_PADDING_IN}
              max={MAX_PADDING_IN}
              step={0.01}
              value={paddingY}
              onChange={(e) => onPaddingYChange(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Move className="w-3.5 h-3.5 text-primary" />
              Logo zoom
            </label>
            <span className="text-xs text-muted-foreground">{Math.round(logoCrop.zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min={MIN_LOGO_ZOOM}
            max={MAX_LOGO_ZOOM}
            step={0.01}
            disabled={!logo}
            value={logoCrop.zoom}
            onChange={(e) => onLogoCropChange({ ...logoCrop, zoom: parseFloat(e.target.value) })}
            className="w-full accent-primary disabled:opacity-40"
          />
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            Drag the logo in the preview to reposition it.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-foreground">QR size</label>
            <span className="text-xs text-muted-foreground">{Math.round(qrScale * 100)}%</span>
          </div>
          <input
            type="range"
            min={MIN_QR_SCALE}
            max={MAX_QR_SCALE}
            step={0.01}
            disabled={!qrDataUrl}
            value={qrScale}
            onChange={(e) => onQrScaleChange(parseFloat(e.target.value))}
            className="w-full accent-primary disabled:opacity-40"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-foreground">Gap between logo &amp; QR</label>
            <span className="text-xs text-muted-foreground">{contentGap.toFixed(2)}&Prime;</span>
          </div>
          <input
            type="range"
            min={MIN_CONTENT_GAP_IN}
            max={MAX_CONTENT_GAP_IN}
            step={0.01}
            value={contentGap}
            onChange={(e) => onContentGapChange(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
            <Pipette className="w-3.5 h-3.5 text-primary" />
            QR color
          </label>
          <ColorSwatchRow value={qrColor} onChange={onQrColorChange} />
          {lowContrast && (
            <p className="text-[11px] text-primary mt-2">
              This color may be too light to scan reliably against white.
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between py-4">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Square className="w-3.5 h-3.5 text-primary" />
              Border
            </label>
            <ToggleSwitch checked={border.enabled} onChange={(enabled) => onBorderChange({ ...border, enabled })} />
          </div>

          {border.enabled && (
            <div className="space-y-4 pb-1">
              <div>
                <span className="text-xs font-semibold text-foreground mb-2 block">Border color</span>
                <ColorSwatchRow value={border.color} onChange={(color) => onBorderChange({ ...border, color })} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">Border width</span>
                  <span className="text-xs text-muted-foreground">{border.width.toFixed(2)}&Prime;</span>
                </div>
                <input
                  type="range"
                  min={MIN_BORDER_WIDTH_IN}
                  max={MAX_BORDER_WIDTH_IN}
                  step={0.005}
                  value={border.width}
                  onChange={(e) => onBorderChange({ ...border, width: parseFloat(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between py-4">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Stamp className="w-3.5 h-3.5 text-primary" />
              Watermark
            </label>
            <ToggleSwitch
              checked={watermark.enabled}
              onChange={(enabled) => onWatermarkChange({ ...watermark, enabled })}
            />
          </div>

          {watermark.enabled && (
            <div className="space-y-4 pb-1">
              <div>
                <span className="text-xs font-semibold text-foreground mb-2 block">Watermark text</span>
                <input
                  type="text"
                  value={watermark.text}
                  maxLength={MAX_WATERMARK_TEXT_LENGTH}
                  onChange={(e) => onWatermarkChange({ ...watermark, text: e.target.value })}
                  placeholder="e.g. SAMPLE"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground mb-2 block">Font</span>
                <div className="flex flex-wrap gap-2">
                  {WATERMARK_FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onWatermarkChange({ ...watermark, font: f.id })}
                      style={{ fontFamily: f.family }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        watermark.font === f.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">Word size</span>
                  <span className="text-xs text-muted-foreground">{Math.round(watermark.scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={MIN_WATERMARK_SCALE}
                  max={MAX_WATERMARK_SCALE}
                  step={0.05}
                  value={watermark.scale}
                  onChange={(e) => onWatermarkChange({ ...watermark, scale: parseFloat(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">Opacity</span>
                  <span className="text-xs text-muted-foreground">{Math.round(watermark.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={MIN_WATERMARK_OPACITY}
                  max={MAX_WATERMARK_OPACITY}
                  step={0.01}
                  value={watermark.opacity}
                  onChange={(e) => onWatermarkChange({ ...watermark, opacity: parseFloat(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
              <p className="text-[11px] text-muted-foreground/70">
                The watermark sits behind the logo and QR code, so neither is ever obscured.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  )
}

function ColorSwatchRow({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      {COLOR_PRESETS.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
            value.toLowerCase() === color.toLowerCase() ? "border-primary" : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Use ${color}`}
        />
      ))}
      <label className="relative w-7 h-7 rounded-full border-2 border-dashed border-border overflow-hidden cursor-pointer flex items-center justify-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Choose a custom color"
        />
        <span
          className="w-full h-full rounded-full"
          style={{
            background: "conic-gradient(from 180deg, #f43f5e, #f59e0b, #22c55e, #3b82f6, #a855f7, #f43f5e)",
          }}
        />
      </label>
    </div>
  )
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function CropMark({ className }: { className: string }) {
  return <div className={`absolute w-4 h-4 border-t-2 border-l-2 border-foreground/25 z-10 ${className}`} aria-hidden />
}
