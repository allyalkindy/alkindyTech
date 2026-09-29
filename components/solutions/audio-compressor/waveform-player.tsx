"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"
import { formatDuration } from "./audio-utils"

interface WaveformPlayerProps {
  src: string
  peaks: number[]
  accent: "muted" | "primary"
}

export function WaveformPlayer({ src, peaks, accent }: WaveformPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    }
    const onLoaded = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("ended", onEnded)
    }
  }, [src])

  // Pause when this player's src changes out from under it (new file, etc.)
  useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
  }, [src])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const seekTo = (clientX: number, rect: DOMRect) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    audio.currentTime = frac * audio.duration
  }

  const activeColor = accent === "primary" ? "bg-primary" : "bg-foreground"
  const idleColor = accent === "primary" ? "bg-primary/20" : "bg-foreground/15"

  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="shrink-0 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div
        role="slider"
        aria-label="Seek"
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={0}
        onClick={(e) => seekTo(e.clientX, e.currentTarget.getBoundingClientRect())}
        onKeyDown={(e) => {
          const audio = audioRef.current
          if (!audio || !audio.duration) return
          if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
          if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5)
        }}
        className="flex-1 h-10 flex items-center gap-px cursor-pointer"
      >
        {peaks.map((p, i) => {
          const played = i / peaks.length < progress
          return (
            <div
              key={i}
              style={{ height: `${Math.max(10, p * 100)}%` }}
              className={`flex-1 rounded-full transition-colors ${played ? activeColor : idleColor}`}
            />
          )
        })}
      </div>

      <span className="text-xs tabular-nums text-muted-foreground w-9 text-right shrink-0">
        {formatDuration(isPlaying || currentTime > 0 ? currentTime : duration)}
      </span>
    </div>
  )
}
