export type AspectRatioId = "landscape" | "square" | "vertical"

export interface AspectRatioOption {
  id: AspectRatioId
  label: string
  sub: string
  width: number
  height: number
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "landscape", label: "Landscape", sub: "16:9 · YouTube", width: 1280, height: 720 },
  { id: "square", label: "Square", sub: "1:1 · Instagram", width: 1080, height: 1080 },
  { id: "vertical", label: "Vertical", sub: "9:16 · Reels / Shorts", width: 720, height: 1280 },
]

export const DEFAULT_ASPECT_RATIO: AspectRatioId = "landscape"

export const MAX_AUDIO_BYTES = 100 * 1024 * 1024 // 100MB
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024 // 20MB
export const MAX_DURATION_SECONDS = 30 * 60 // 30 minutes

// The video content never moves — it's one static image — so there is
// nothing for extra frames to capture. 1fps is the standard rate for this
// exact "image + audio" recipe and cuts encode work by ~24x with zero
// visible difference; ultrafast trades away compression efficiency that
// would normally protect motion detail, which this content doesn't have.
export const VIDEO_FPS = 1
export const X264_PRESET = "ultrafast"
export const AUDIO_BITRATE_KBPS = 192

// @ffmpeg/ffmpeg's own default core URL isn't pinned to a version we've
// verified — we load a specific, known-good @ffmpeg/core build from unpkg
// instead, converted to a blob URL to sidestep cross-origin worker issues.
export const FFMPEG_CORE_VERSION = "0.12.10"
export const FFMPEG_CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`
