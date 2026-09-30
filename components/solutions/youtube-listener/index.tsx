"use client"

// YouTube Listener — paste a link, play the audio, keep listening with
// real lock-screen controls.
//
// How it's wired together:
//   1. POST /api/resolve { url } asks our backend to run yt-dlp and hand
//      back { id, title, thumbnail, duration }. It does NOT return the
//      real YouTube CDN URL — that stays server-side.
//   2. The <audio> element's src is set to /api/stream/{id}, our own
//      backend route. The browser's normal HTTP Range requests against
//      that route are what make streaming and seeking work — we never
//      download the whole file up front.
//   3. The Media Session API tells the OS "this tab is playing media" so
//      the phone's lock screen shows a title, artwork, and play/pause/seek
//      controls that control this exact <audio> element.

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, Play, Pause, AlertCircle } from "lucide-react"

interface VideoInfo {
  id: string
  title: string
  thumbnail: string
  duration: number
}

type Status = "idle" | "resolving" | "ready" | "error"

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function YoutubeListener() {
  const [url, setUrl] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  // --- Resolve the pasted link and start playback ---------------------

  const handleResolve = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || status === "resolving") return

    setStatus("resolving")
    setErrorMessage("")

    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error ?? "Couldn't resolve that link")
      }

      setVideoInfo(data)
      setCurrentTime(0)
      setDuration(data.duration ?? 0)
      setStatus("ready")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
      setStatus("error")
    }
  }, [url, status])

  // Once a new video is resolved, load its stream and start playing.
  // Split from handleResolve so the <audio> element's src (driven by
  // videoInfo.id in the JSX below) has already updated before we call
  // play() on it.
  useEffect(() => {
    if (!videoInfo) return
    const audio = audioRef.current
    if (!audio) return
    audio.load()
    audio.play().catch(() => {
      // Autoplay can be blocked by the browser; the user can just press
      // the play button in the player instead.
    })
  }, [videoInfo?.id])

  // --- Native <audio> element event handlers ---------------------------

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)

    // Keeps the lock-screen scrubber in sync with real playback position.
    if ("mediaSession" in navigator && isFinite(audio.duration) && audio.duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: audio.currentTime,
        })
      } catch {
        // Can throw mid-seek if position is briefly out of range — safe to ignore.
      }
    }
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (audio && isFinite(audio.duration)) setDuration(audio.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  // --- Media Session API: lock-screen metadata + controls --------------

  useEffect(() => {
    if (!videoInfo || typeof navigator === "undefined" || !("mediaSession" in navigator)) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: videoInfo.title,
      artist: "YouTube Listener",
      artwork: videoInfo.thumbnail
        ? [{ src: videoInfo.thumbnail, sizes: "512x512", type: "image/jpeg" }]
        : [],
    })

    const audio = audioRef.current

    navigator.mediaSession.setActionHandler("play", () => audio?.play().catch(() => {}))
    navigator.mediaSession.setActionHandler("pause", () => audio?.pause())
    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      if (!audio) return
      audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset ?? 10))
    })
    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      if (!audio) return
      audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset ?? 10))
    })
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (!audio || details.seekTime == null) return
      audio.currentTime = details.seekTime
    })

    return () => {
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
      navigator.mediaSession.setActionHandler("seekbackward", null)
      navigator.mediaSession.setActionHandler("seekforward", null)
      navigator.mediaSession.setActionHandler("seekto", null)
    }
  }, [videoInfo])

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
    }
  }, [isPlaying])

  // --- PWA: register the service worker, scoped to this page only ------

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    navigator.serviceWorker
      .register("/sw.js", { scope: "/solutions/youtube-listener/" })
      .catch(() => {
        // Not fatal — the page still works, it just won't behave as well
        // as an installed app when the phone is locked.
      })
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <form onSubmit={handleResolve} className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          inputMode="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube link…"
          className="flex-1 rounded-full border border-border bg-card px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={status === "resolving" || !url.trim()}
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background rounded-full px-7 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {status === "resolving" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {status === "resolving" ? "Resolving…" : "Play"}
        </button>
      </form>

      {status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">{errorMessage}</p>
        </div>
      )}

      {videoInfo && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0 bg-muted"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground line-clamp-2">{videoInfo.title}</p>
              {isBuffering && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Buffering…
                </p>
              )}
            </div>
          </div>

          <audio
            ref={audioRef}
            src={`/api/stream/${videoInfo.id}`}
            preload="none"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onWaiting={() => setIsBuffering(true)}
            onCanPlay={() => setIsBuffering(false)}
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setErrorMessage("Playback failed — the link may have expired. Try pasting it again.")
              setStatus("error")
            }}
          />

          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={togglePlayPause}
              className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Audio streams from our server in small chunks, a few seconds at a time — nothing is
        downloaded to your device as a full file.
      </p>
    </div>
  )
}
