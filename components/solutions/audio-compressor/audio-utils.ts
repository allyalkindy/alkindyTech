import { WAVEFORM_BARS } from "./constants"

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[unitIndex]}`
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function estimateCompressedBytes(durationSeconds: number, kbps: number): number {
  return Math.round(((kbps * 1000) / 8) * durationSeconds)
}

/** Peak amplitude per bucket, averaged across channels, normalized 0..1. */
export function computeWaveformPeaks(buffer: AudioBuffer, numBars = WAVEFORM_BARS): number[] {
  const channels = buffer.numberOfChannels
  const length = buffer.length
  const blockSize = Math.max(1, Math.floor(length / numBars))
  const channelData: Float32Array[] = []
  for (let c = 0; c < channels; c++) channelData.push(buffer.getChannelData(c))

  const peaks: number[] = []
  for (let i = 0; i < numBars; i++) {
    const start = i * blockSize
    const end = Math.min(start + blockSize, length)
    let peak = 0
    for (let j = start; j < end; j++) {
      let sum = 0
      for (let c = 0; c < channels; c++) sum += Math.abs(channelData[c][j])
      const avg = sum / channels
      if (avg > peak) peak = avg
    }
    peaks.push(peak)
  }
  const max = Math.max(...peaks, 0.0001)
  return peaks.map((p) => p / max)
}

export function closestStandardBitrate(bitrates: readonly number[], target: number): number {
  return bitrates.reduce((closest, current) =>
    Math.abs(current - target) < Math.abs(closest - target) ? current : closest
  )
}
