"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  UploadCloud,
  Loader2,
  Download,
  Gauge,
  FileAudio,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { WaveformPlayer } from "./waveform-player"
import {
  computeWaveformPeaks,
  estimateCompressedBytes,
  formatBytes,
  formatDuration,
} from "./audio-utils"
import {
  BITRATE_PRESETS,
  DEFAULT_BITRATE,
  MAX_FILE_BYTES,
  MP3_BITRATES,
  type CompressedAudio,
  type DecodedAudio,
} from "./constants"

export function AudioCompressor() {
  const [isDragging, setIsDragging] = useState(false)
  const [isDecoding, setIsDecoding] = useState(false)
  const [audio, setAudio] = useState<DecodedAudio | null>(null)
  const [bitrate, setBitrate] = useState(DEFAULT_BITRATE)
  const [isEncoding, setIsEncoding] = useState(false)
  const [encodeProgress, setEncodeProgress] = useState(0)
  const [compressed, setCompressed] = useState<CompressedAudio | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const workerRef = useRef<Worker | null>(null)
  // Tracks every blob URL we've ever created so unmount cleanup can revoke
  // all of them — a plain empty-dep effect closing over `audio`/`compressed`
  // would only ever see their initial `null` values, never the latest one.
  const objectUrlsRef = useRef<Set<string>>(new Set())

  const trackUrl = (url: string) => {
    objectUrlsRef.current.add(url)
    return url
  }

  const revokeUrl = (url: string | undefined) => {
    if (!url) return
    URL.revokeObjectURL(url)
    objectUrlsRef.current.delete(url)
  }

  useEffect(() => {
    return () => {
      workerRef.current?.terminate()
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioContextRef.current = new Ctor()
    }
    return audioContextRef.current
  }

  const handleFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return
    if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|aac|ogg|flac|webm)$/i.test(file.name)) {
      toast.error("That's not an audio file", { description: "Upload an MP3, WAV, M4A, OGG, or FLAC file." })
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("File's too large", { description: `Keep your audio under ${formatBytes(MAX_FILE_BYTES)}.` })
      return
    }

    setIsDecoding(true)
    setCompressed(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const ctx = getAudioContext()
      const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
      const peaks = computeWaveformPeaks(buffer)
      const originalUrl = trackUrl(URL.createObjectURL(file))

      revokeUrl(audio?.originalUrl)
      revokeUrl(compressed?.url)

      setAudio({
        fileName: file.name,
        originalBytes: file.size,
        originalUrl,
        duration: buffer.duration,
        sampleRate: buffer.sampleRate,
        channels: buffer.numberOfChannels,
        left: buffer.getChannelData(0).slice(),
        right: buffer.numberOfChannels > 1 ? buffer.getChannelData(1).slice() : null,
        peaks,
      })
    } catch (err) {
      toast.error("Couldn't read that audio file", {
        description: err instanceof Error ? err.message : "Try a different file or format.",
      })
    } finally {
      setIsDecoding(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, compressed])

  const handleCompress = () => {
    if (!audio) return
    setIsEncoding(true)
    setEncodeProgress(0)

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("./encode-worker.ts", import.meta.url))
    }
    const worker = workerRef.current

    worker.onmessage = async (event: MessageEvent) => {
      const { type } = event.data
      if (type === "progress") {
        setEncodeProgress(event.data.value)
        return
      }
      if (type === "error") {
        toast.error("Compression failed", { description: event.data.message })
        setIsEncoding(false)
        return
      }
      if (type === "done") {
        // Definitely ArrayBuffer-backed (built in the worker via `new Uint8Array(n)`),
        // but TS's structural typing can't rule out SharedArrayBuffer without this assertion.
        const bytes = event.data.data as Uint8Array<ArrayBuffer>
        const blob = new Blob([bytes], { type: "audio/mpeg" })
        const url = trackUrl(URL.createObjectURL(blob))

        try {
          const ctx = getAudioContext()
          const arrayBuffer = await blob.arrayBuffer()
          const decoded = await ctx.decodeAudioData(arrayBuffer)
          const peaks = computeWaveformPeaks(decoded)

          revokeUrl(compressed?.url)
          setCompressed({ blob, url, bytes: blob.size, duration: decoded.duration, peaks, kbps: bitrate })
        } catch {
          // Even if re-decoding for a fresh waveform fails, the file itself is valid — fall back gracefully.
          revokeUrl(compressed?.url)
          setCompressed({ blob, url, bytes: blob.size, duration: audio.duration, peaks: audio.peaks, kbps: bitrate })
        }
        setIsEncoding(false)
        setEncodeProgress(1)
      }
    }

    // Deliberately NOT using a transfer list here: transferring would
    // detach audio.left/audio.right's buffers on the main thread, so
    // re-compressing the same file at a different bitrate (the whole
    // point of Step 2) would fail on the second click. A structured-clone
    // copy costs a little more but keeps the decoded audio reusable.
    worker.postMessage({
      channels: audio.channels,
      sampleRate: audio.sampleRate,
      kbps: bitrate,
      left: audio.left,
      right: audio.right,
    })
  }

  const handleDownload = () => {
    if (!compressed || !audio) return
    const baseName = audio.fileName.replace(/\.[^.]+$/, "")
    const a = document.createElement("a")
    a.href = compressed.url
    a.download = `${baseName}-compressed.mp3`
    document.body.appendChild(a)
    a.click()
    a.remove()
    toast.success("Compressed audio downloaded")
  }

  const estimatedBytes = audio ? estimateCompressedBytes(audio.duration, bitrate) : 0
  const reduction =
    audio && audio.originalBytes > 0 ? Math.max(0, 1 - estimatedBytes / audio.originalBytes) : 0
  const actualReduction =
    audio && compressed && audio.originalBytes > 0 ? Math.max(0, 1 - compressed.bytes / audio.originalBytes) : 0

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Step 1 — Upload */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
            1
          </span>
          <h2 className="font-serif text-xl text-foreground">Upload your audio</h2>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {audio ? (
          <div className="border border-border rounded-2xl p-5 bg-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileAudio className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{audio.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(audio.originalBytes)} · {formatDuration(audio.duration)} ·{" "}
                  {audio.channels === 2 ? "Stereo" : "Mono"} · {audio.sampleRate.toLocaleString()} Hz
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:underline shrink-0"
              >
                Replace
              </button>
            </div>
            <WaveformPlayer src={audio.originalUrl} peaks={audio.peaks} accent="muted" />
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
            className={`flex flex-col items-center justify-center text-center gap-3 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
            }`}
          >
            {isDecoding ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-primary" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isDecoding ? "Reading your audio…" : "Drag & drop your audio file"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse · MP3, WAV, M4A, OGG, FLAC up to {formatBytes(MAX_FILE_BYTES)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step 2 — Quality */}
      <div className={audio ? "" : "opacity-40 pointer-events-none"}>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
            2
          </span>
          <h2 className="font-serif text-xl text-foreground">Choose your quality</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {BITRATE_PRESETS.map((preset) => (
            <button
              key={preset.kbps}
              onClick={() => setBitrate(preset.kbps)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                bitrate === preset.kbps
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {preset.label}
              <span className="text-muted-foreground font-normal"> · {preset.kbps} kbps</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Gauge className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Bitrate</span>
          <span className="text-xs text-muted-foreground ml-auto">{bitrate} kbps</span>
        </div>
        <input
          type="range"
          min={0}
          max={MP3_BITRATES.length - 1}
          step={1}
          value={MP3_BITRATES.indexOf(bitrate as (typeof MP3_BITRATES)[number])}
          onChange={(e) => setBitrate(MP3_BITRATES[parseInt(e.target.value, 10)])}
          className="w-full accent-primary"
        />

        {audio && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Estimated size</span>
            <span className="font-semibold text-foreground">
              ~{formatBytes(estimatedBytes)}
              {reduction > 0.02 && (
                <span className="text-moss font-medium"> · {Math.round(reduction * 100)}% smaller</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Step 3 — Compress & download */}
      <div className={audio ? "" : "opacity-40 pointer-events-none"}>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
            3
          </span>
          <h2 className="font-serif text-xl text-foreground">Compress &amp; compare</h2>
        </div>

        <button
          onClick={handleCompress}
          disabled={!audio || isEncoding}
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isEncoding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Compressing… {Math.round(encodeProgress * 100)}%
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Compress Audio
            </>
          )}
        </button>

        {isEncoding && (
          <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs">
            <div
              className="h-full bg-primary transition-all duration-150"
              style={{ width: `${Math.max(4, encodeProgress * 100)}%` }}
            />
          </div>
        )}

        {compressed && audio && (
          <div className="mt-8 space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Original</p>
                <p className="font-serif text-2xl text-foreground">{formatBytes(audio.originalBytes)}</p>
              </div>
              <div className="rounded-xl border border-border p-4 text-center flex flex-col items-center justify-center">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 text-center">
                <p className="text-xs text-primary mb-1">Compressed</p>
                <p className="font-serif text-2xl text-primary">{formatBytes(compressed.bytes)}</p>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <span className="font-semibold text-moss">{Math.round(actualReduction * 100)}% smaller</span> at{" "}
              {compressed.kbps} kbps — have a listen below before you download.
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2">Original</p>
                <WaveformPlayer src={audio.originalUrl} peaks={audio.peaks} accent="muted" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-primary mb-2">Compressed</p>
                <WaveformPlayer src={compressed.url} peaks={compressed.peaks} accent="primary" />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                Download Compressed MP3
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Everything happens in your browser — nothing is uploaded anywhere.
      </p>
    </div>
  )
}
