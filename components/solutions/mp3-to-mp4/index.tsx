"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  UploadCloud,
  ImagePlus,
  Loader2,
  Download,
  FileAudio,
  Sparkles,
  X,
  Clapperboard,
} from "lucide-react"
import { WaveformPlayer } from "@/components/solutions/audio-compressor/waveform-player"
import { computeWaveformPeaks, formatBytes, formatDuration } from "@/components/solutions/audio-compressor/audio-utils"
import {
  ASPECT_RATIOS,
  AUDIO_BITRATE_KBPS,
  DEFAULT_ASPECT_RATIO,
  FFMPEG_CORE_BASE_URL,
  MAX_AUDIO_BYTES,
  MAX_DURATION_SECONDS,
  MAX_IMAGE_BYTES,
  VIDEO_FPS,
  X264_PRESET,
  type AspectRatioId,
} from "./constants"

interface AudioInfo {
  file: File
  url: string
  duration: number
  peaks: number[]
}

interface ImageInfo {
  file: File
  url: string
}

interface VideoResult {
  url: string
  bytes: number
}

type EngineState = "idle" | "loading" | "ready"

function extFromFile(file: File, fallback: string) {
  const match = /\.([a-z0-9]+)$/i.exec(file.name)
  return match ? match[1].toLowerCase() : fallback
}

export function Mp3ToMp4() {
  const [audio, setAudio] = useState<AudioInfo | null>(null)
  const [image, setImage] = useState<ImageInfo | null>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>(DEFAULT_ASPECT_RATIO)
  const [isDecoding, setIsDecoding] = useState(false)
  const [isDraggingAudio, setIsDraggingAudio] = useState(false)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [engineState, setEngineState] = useState<EngineState>("idle")
  const [engineLoadProgress, setEngineLoadProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [result, setResult] = useState<VideoResult | null>(null)

  const audioInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const ffmpegRef = useRef<import("@ffmpeg/ffmpeg").FFmpeg | null>(null)
  const ffmpegLoadPromiseRef = useRef<Promise<import("@ffmpeg/ffmpeg").FFmpeg> | null>(null)
  const hasPrewarmedRef = useRef(false)
  const objectUrlsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      ffmpegRef.current?.terminate()
    }
  }, [])

  const trackUrl = (url: string) => {
    objectUrlsRef.current.add(url)
    return url
  }

  const revokeUrl = (url: string | undefined) => {
    if (!url) return
    URL.revokeObjectURL(url)
    objectUrlsRef.current.delete(url)
  }

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioContextRef.current = new Ctor()
    }
    return audioContextRef.current
  }

  const handleAudioFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return
    if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|aac|ogg|flac|webm)$/i.test(file.name)) {
      toast.error("That's not an audio file", { description: "Upload an MP3, WAV, M4A, OGG, or FLAC file." })
      return
    }
    if (file.size > MAX_AUDIO_BYTES) {
      toast.error("Audio file's too large", { description: `Keep it under ${formatBytes(MAX_AUDIO_BYTES)}.` })
      return
    }

    setIsDecoding(true)
    setResult(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const ctx = getAudioContext()
      const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0))

      if (buffer.duration > MAX_DURATION_SECONDS) {
        toast.error("That audio is too long", {
          description: `Keep it under ${Math.round(MAX_DURATION_SECONDS / 60)} minutes.`,
        })
        return
      }

      const peaks = computeWaveformPeaks(buffer)
      const url = trackUrl(URL.createObjectURL(file))
      setAudio((prev) => {
        revokeUrl(prev?.url)
        return { file, url, duration: buffer.duration, peaks }
      })
    } catch (err) {
      toast.error("Couldn't read that audio file", {
        description: err instanceof Error ? err.message : "Try a different file or format.",
      })
    } finally {
      setIsDecoding(false)
    }
  }, [])

  const handleImageFile = useCallback((file: File | undefined | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("That's not an image", { description: "Upload a PNG, JPG, or WEBP file." })
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image's too large", { description: `Keep it under ${formatBytes(MAX_IMAGE_BYTES)}.` })
      return
    }
    setResult(null)
    const url = trackUrl(URL.createObjectURL(file))
    setImage((prev) => {
      revokeUrl(prev?.url)
      return { file, url }
    })
  }, [])

  // Callable any number of times, from anywhere (background prewarm and the
  // Generate click both call it) — every caller after the first just awaits
  // the same in-flight load instead of racing a second download.
  const ensureFFmpeg = () => {
    if (ffmpegRef.current?.loaded) return Promise.resolve(ffmpegRef.current)
    if (ffmpegLoadPromiseRef.current) return ffmpegLoadPromiseRef.current

    const promise = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg")
      const { toBlobURL } = await import("@ffmpeg/util")

      const ffmpeg = ffmpegRef.current ?? new FFmpeg()
      ffmpegRef.current = ffmpeg

      setEngineState("loading")
      setEngineLoadProgress(0)
      try {
        const coreURL = await toBlobURL(`${FFMPEG_CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript")
        // The .wasm binary is the one large download (tens of MB); track
        // its real byte progress so the bar reflects something true.
        const wasmURL = await toBlobURL(
          `${FFMPEG_CORE_BASE_URL}/ffmpeg-core.wasm`,
          "application/wasm",
          true,
          ({ received, total }) => {
            if (total > 0) setEngineLoadProgress(received / total)
          },
        )
        await ffmpeg.load({ coreURL, wasmURL })
        setEngineState("ready")
        setEngineLoadProgress(1)
        return ffmpeg
      } catch (err) {
        setEngineState("idle")
        setEngineLoadProgress(0)
        ffmpegLoadPromiseRef.current = null
        throw err
      }
    })()

    ffmpegLoadPromiseRef.current = promise
    return promise
  }

  // Start downloading the video engine the moment the user shows real
  // intent (their first upload), so the one-time ~30MB fetch runs quietly
  // while they're still picking a format — by the time they hit Generate,
  // it's usually already there instead of making that click the slow part.
  useEffect(() => {
    if (hasPrewarmedRef.current) return
    if (!audio && !image) return
    hasPrewarmedRef.current = true
    ensureFFmpeg().catch(() => {
      // Swallowed: a real failure (offline, blocked CDN) surfaces again,
      // loudly, when handleGenerate's own ensureFFmpeg call rejects.
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, image])

  const handleGenerate = async () => {
    if (!audio || !image) return
    setIsGenerating(true)
    setGenerateProgress(0)
    revokeUrl(result?.url)
    setResult(null)

    try {
      const { fetchFile } = await import("@ffmpeg/util")
      const ffmpeg = await ensureFFmpeg()

      const onProgress = ({ progress }: { progress: number }) => {
        setGenerateProgress(Math.min(1, Math.max(0, progress)))
      }
      ffmpeg.on("progress", onProgress)

      const imageExt = extFromFile(image.file, "jpg")
      const audioExt = extFromFile(audio.file, "mp3")
      const imagePath = `input-image.${imageExt}`
      const audioPath = `input-audio.${audioExt}`
      const outputPath = "output.mp4"

      await ffmpeg.writeFile(imagePath, await fetchFile(image.file))
      await ffmpeg.writeFile(audioPath, await fetchFile(audio.file))

      const preset = ASPECT_RATIOS.find((r) => r.id === aspectRatio) ?? ASPECT_RATIOS[0]

      const code = await ffmpeg.exec([
        "-loop", "1",
        // "-r" here, before this "-i", sets how fast frames are generated
        // from the looped still image itself — not just the output rate.
        // Placed after the filters instead, ffmpeg would still generate and
        // scale/crop the image at its native ~25fps before dropping most of
        // those frames at the very end, doing ~25x more filter work for a
        // result that looks identical either way.
        "-r", String(VIDEO_FPS),
        "-i", imagePath,
        "-i", audioPath,
        "-c:v", "libx264",
        "-preset", X264_PRESET,
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", `${AUDIO_BITRATE_KBPS}k`,
        "-pix_fmt", "yuv420p",
        "-vf", `scale=${preset.width}:${preset.height}:force_original_aspect_ratio=increase,crop=${preset.width}:${preset.height}`,
        "-shortest",
        // At 1fps the last video frame's nominal duration is a full
        // second, so -shortest alone can leave the video track up to ~2s
        // longer than the audio (silent tail after the music ends). We
        // already know the audio's exact decoded duration, so hard-trim to
        // it explicitly rather than relying on frame-granularity snapping.
        "-t", String(audio.duration),
        outputPath,
      ])

      ffmpeg.off("progress", onProgress)

      if (code !== 0) {
        throw new Error("The video engine couldn't process those files.")
      }

      const data = await ffmpeg.readFile(outputPath)
      if (typeof data === "string") {
        throw new Error("The video engine returned an unexpected result.")
      }
      // readFile returns Uint8Array<ArrayBufferLike>; Blob wants a definite
      // ArrayBuffer, so copy into a fresh, unambiguously-typed array.
      const bytes = new Uint8Array(data)
      const blob = new Blob([bytes], { type: "video/mp4" })
      const url = trackUrl(URL.createObjectURL(blob))
      setResult({ url, bytes: blob.size })

      await ffmpeg.deleteFile(imagePath).catch(() => {})
      await ffmpeg.deleteFile(audioPath).catch(() => {})
      await ffmpeg.deleteFile(outputPath).catch(() => {})
    } catch (err) {
      toast.error("Couldn't generate the video", {
        description: err instanceof Error ? err.message : "Try a different file or a shorter clip.",
      })
    } finally {
      setIsGenerating(false)
      setGenerateProgress(0)
    }
  }

  const handleDownload = () => {
    if (!result || !audio) return
    const baseName = audio.file.name.replace(/\.[^.]+$/, "")
    const a = document.createElement("a")
    a.href = result.url
    a.download = `${baseName}.mp4`
    document.body.appendChild(a)
    a.click()
    a.remove()
    toast.success("Video downloaded")
  }

  const canGenerate = Boolean(audio && image) && !isGenerating

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Step 1 — Audio */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
            1
          </span>
          <h2 className="font-serif text-xl text-foreground">Upload your audio</h2>
        </div>

        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
          className="sr-only"
          onChange={(e) => handleAudioFile(e.target.files?.[0])}
        />

        {audio ? (
          <div className="border border-border rounded-2xl p-5 bg-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileAudio className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{audio.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(audio.file.size)} · {formatDuration(audio.duration)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:underline shrink-0"
              >
                Replace
              </button>
            </div>
            <WaveformPlayer src={audio.url} peaks={audio.peaks} accent="muted" />
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => audioInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") audioInputRef.current?.click()
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDraggingAudio(true)
            }}
            onDragLeave={() => setIsDraggingAudio(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDraggingAudio(false)
              handleAudioFile(e.dataTransfer.files?.[0])
            }}
            className={`flex flex-col items-center justify-center text-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
              isDraggingAudio ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
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
                or click to browse · MP3, WAV, M4A, OGG, FLAC up to {formatBytes(MAX_AUDIO_BYTES)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step 2 — Image */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
            2
          </span>
          <h2 className="font-serif text-xl text-foreground">Upload a background image</h2>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleImageFile(e.target.files?.[0])}
        />

        {image ? (
          <div className="border border-border rounded-2xl p-4 bg-card flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt="Background preview" className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{image.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(image.file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                revokeUrl(image.url)
                setImage(null)
                setResult(null)
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => imageInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") imageInputRef.current?.click()
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDraggingImage(true)
            }}
            onDragLeave={() => setIsDraggingImage(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDraggingImage(false)
              handleImageFile(e.dataTransfer.files?.[0])
            }}
            className={`flex flex-col items-center justify-center text-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
              isDraggingImage ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
            }`}
          >
            <ImagePlus className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Drag &amp; drop your background image</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse · PNG, JPG, WEBP up to {formatBytes(MAX_IMAGE_BYTES)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step 3 — Format */}
      <div className={audio && image ? "" : "opacity-40 pointer-events-none"}>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
            3
          </span>
          <h2 className="font-serif text-xl text-foreground">Choose a format</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {ASPECT_RATIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setAspectRatio(preset.id)}
              className={`px-4 py-2.5 rounded-2xl text-left border transition-colors ${
                aspectRatio === preset.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className={`block text-sm font-semibold ${aspectRatio === preset.id ? "text-primary" : "text-foreground"}`}>
                {preset.label}
              </span>
              <span className="block text-xs text-muted-foreground">{preset.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 4 — Generate & download */}
      <div className={audio && image ? "" : "opacity-40 pointer-events-none"}>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold shrink-0">
            4
          </span>
          <h2 className="font-serif text-xl text-foreground">Generate your video</h2>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {engineState !== "ready"
                ? `Loading video engine… ${Math.round(engineLoadProgress * 100)}%`
                : `Generating… ${Math.round(generateProgress * 100)}%`}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Video
            </>
          )}
        </button>

        {isGenerating && (
          <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs">
            <div
              className="h-full bg-primary transition-all duration-150"
              style={{
                width: `${Math.max(4, (engineState === "ready" ? generateProgress : engineLoadProgress) * 100)}%`,
              }}
            />
          </div>
        )}

        {!isGenerating && engineState === "loading" && (
          <p className="text-xs text-muted-foreground mt-3">
            Warming up the video engine in the background ({Math.round(engineLoadProgress * 100)}%) —
            it'll likely be ready before you hit Generate.
          </p>
        )}
        {!isGenerating && engineState === "idle" && (
          <p className="text-xs text-muted-foreground mt-3">
            The first video may take a few extra seconds to load the video engine.
          </p>
        )}

        {result && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clapperboard className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Video ready</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(result.bytes)}</p>
                </div>
              </div>
            </div>

            <video
              src={result.url}
              controls
              className="w-full rounded-2xl border border-border bg-black"
            />

            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background rounded-full pl-7 pr-6 py-4 text-base font-semibold hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                Download MP4
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
