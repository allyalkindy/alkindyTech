// Standard MPEG-1 Layer III bitrates — LAME's CBR mode expects one of
// these exact values, not an arbitrary number.
export const MP3_BITRATES = [32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320] as const

export const DEFAULT_BITRATE = 160

export const BITRATE_PRESETS: { kbps: number; label: string }[] = [
  { kbps: 96, label: "Smaller" },
  { kbps: 160, label: "Balanced" },
  { kbps: 256, label: "High Quality" },
  { kbps: 320, label: "Maximum" },
]

export const MAX_FILE_BYTES = 150 * 1024 * 1024 // 150MB
export const WAVEFORM_BARS = 90

export interface DecodedAudio {
  fileName: string
  originalBytes: number
  originalUrl: string
  duration: number
  sampleRate: number
  channels: number
  left: Float32Array
  right: Float32Array | null
  peaks: number[]
}

export interface CompressedAudio {
  blob: Blob
  url: string
  bytes: number
  duration: number
  peaks: number[]
  kbps: number
}
