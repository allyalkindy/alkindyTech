export interface NormalizedLogo {
  dataUrl: string
  naturalWidth: number
  naturalHeight: number
  name: string
}

export interface Crop {
  zoom: number
  offsetXFrac: number
  offsetYFrac: number
}

export interface StickerSize {
  width: number
  height: number
}

export interface Border {
  enabled: boolean
  color: string
  width: number
}

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w"

export const DEFAULT_CROP: Crop = { zoom: 1, offsetXFrac: 0, offsetYFrac: 0 }

export const DEFAULT_STICKER_SIZE: StickerSize = { width: 3.5, height: 2 }
export const MIN_STICKER_WIDTH = 2.5
export const MAX_STICKER_WIDTH = 6
export const MIN_STICKER_HEIGHT = 1.25
export const MAX_STICKER_HEIGHT = 4
export const MIN_WIDTH_HEIGHT_GAP = 0.35 // enforced: width must stay this much larger than height

export const SIZE_PRESETS: StickerSize[] = [
  { width: 3.5, height: 2 },
  { width: 4, height: 2.25 },
  { width: 5, height: 2.75 },
]

export const MIN_LOGO_ZOOM = 1
export const MAX_LOGO_ZOOM = 3

export const MIN_QR_SCALE = 0.55
export const MAX_QR_SCALE = 1

export const DEFAULT_QR_COLOR = "#1a1512"
export const COLOR_PRESETS = ["#1a1512", "#000000", "#b3521f", "#2f3b2a", "#1d3a6e"]

export const STICKER_PADDING_IN = 0.28
export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const EXPORT_DPI = 400

export const DEFAULT_CONTENT_GAP_IN = 0.3
export const MIN_CONTENT_GAP_IN = 0.06
export const MAX_CONTENT_GAP_IN = 0.6

export const DEFAULT_BORDER: Border = { enabled: false, color: "#1a1512", width: 0.04 }
export const MIN_BORDER_WIDTH_IN = 0.02
export const MAX_BORDER_WIDTH_IN = 0.12

// Minimum room, in inches, a logo/QR frame must keep on each side —
// guards content geometry against gap/border values that would otherwise
// collapse a frame to zero or negative width.
export const MIN_FRAME_SIZE_IN = 0.5
