// Wraps the yt-dlp command-line tool to turn a YouTube URL into:
//   1) metadata to show the user (title, thumbnail, duration)
//   2) a direct, temporary CDN URL for the best audio-only track
//
// yt-dlp itself must be installed on the machine running this server
// (e.g. `pip install yt-dlp` or the standalone binary) — it is not an npm
// package, so there is nothing to add to package.json for it.

import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { after } from "next/server"
import { redis } from "./redisRateLimiter"
import { toCanonicalYouTubeUrl } from "@/lib/youtubeUtils/utils"

const execFileAsync = promisify(execFile)

export interface ResolvedStream {
  id: string
  title: string
  thumbnail: string
  duration: number
  directUrl: string
  contentType: string
  expiresAt: number // unix seconds — when YouTube's signed URL dies
}

const CACHE_PREFIX = "yt-stream:"

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  m4a: "audio/mp4",
  webm: "audio/webm",
  mp3: "audio/mpeg",
  opus: "audio/ogg",
}

// YouTube's CDN URLs carry their own expiry as an `expire=<unix seconds>`
// query param. We trust that instead of guessing a fixed TTL, so we never
// serve (or cache) a URL we already know is dead.
function readExpiry(directUrl: string): number {
  const match = /[?&]expire=(\d+)/.exec(directUrl)
  const oneHourFromNow = Math.floor(Date.now() / 1000) + 60 * 60
  return match ? Number(match[1]) : oneHourFromNow
}

async function runYtDlp(youtubeUrl: string): Promise<any> {
  // execFile (not exec) passes arguments as an array rather than building a
  // shell string, so the user-supplied URL can never break out into shell
  // syntax — this is what keeps this safe from command injection.
  const { stdout } = await execFileAsync(
    "yt-dlp",
    [
      "--dump-json",
      "--no-playlist",
      "--no-warnings",
      // The audio-only formats we pick (e.g. itag 140) already come from
      // the initial player response — yt-dlp only fetches the separate HLS
      // manifest to list additional formats we'd never choose anyway. This
      // one flag roughly halves resolve time (skips a whole network
      // round-trip) with no effect on the format we end up using.
      "--extractor-args", "youtube:skip=hls",
      // Prefer m4a (AAC): it plays natively on every major browser and on
      // iOS Safari, unlike webm/opus which Safari doesn't support.
      "-f", "bestaudio[ext=m4a]/bestaudio",
      youtubeUrl,
    ],
    { timeout: 20_000, maxBuffer: 10 * 1024 * 1024 },
  )
  return JSON.parse(stdout)
}

// Resolves a YouTube URL to a playable audio stream, and caches the result
// in Redis (keyed by video id) until shortly before it expires — this is
// the "cache the resolved stream URL server-side for a short time" step.
export async function resolveYouTubeAudio(youtubeUrl: string): Promise<ResolvedStream> {
  const info = await runYtDlp(youtubeUrl)

  const directUrl: string = info.url
  const expiresAt = readExpiry(directUrl)

  const resolved: ResolvedStream = {
    id: info.id,
    title: info.title ?? "Untitled",
    thumbnail: info.thumbnail ?? "",
    duration: info.duration ?? 0,
    directUrl,
    contentType: CONTENT_TYPE_BY_EXT[info.ext] ?? "application/octet-stream",
    expiresAt,
  }

  const secondsUntilExpiry = expiresAt - Math.floor(Date.now() / 1000)
  const ttl = Math.max(60, secondsUntilExpiry - 60) // refresh a minute early

  // The caller (the /api/resolve response) doesn't need this write to have
  // landed — only a *later* /api/stream call does, and that already falls
  // back to re-resolving if the cache write hasn't finished yet. So we
  // defer it with next/server's after(), which runs it once the response
  // has been sent instead of making the user wait on a full Redis
  // round-trip (~400-500ms) for no benefit to their current request.
  // (Plain "don't await it" would work the same way in a long-running
  // Node process, but on serverless the function can freeze the instant
  // the response goes out — after() is what guarantees this still runs.)
  //
  // @upstash/redis auto-serializes/deserializes JSON-able values by
  // default, so we store the object directly rather than stringifying it
  // ourselves — double-encoding it here would make get() hand back an
  // already-parsed object that JSON.parse() can't re-parse.
  after(() =>
    redis.set(CACHE_PREFIX + resolved.id, resolved, { ex: ttl }).catch((err) => {
      // Caching is an optimization, not a requirement — if Redis is briefly
      // unreachable, the next /api/stream call just re-runs yt-dlp instead.
      console.error("STREAM_CACHE_WRITE_ERROR:", err)
    }),
  )

  return resolved
}

// Looks up a previously-resolved stream by video id. Returns null if it was
// never cached, if it's about to expire, or if the cache itself couldn't be
// reached — any of those simply tell the caller to re-resolve instead.
export async function getCachedStream(id: string): Promise<ResolvedStream | null> {
  let stream: ResolvedStream | null
  try {
    // Already deserialized back into an object by the SDK — see the note
    // in resolveYouTubeAudio about why we don't JSON.parse this ourselves.
    stream = await redis.get<ResolvedStream>(CACHE_PREFIX + id)
  } catch (err) {
    console.error("STREAM_CACHE_READ_ERROR:", err)
    return null
  }
  if (!stream) return null

  const thirtySecondsFromNow = Math.floor(Date.now() / 1000) + 30
  if (stream.expiresAt <= thirtySecondsFromNow) return null

  return stream
}

// Used by the stream endpoint when a cached URL turns out to be dead (or
// was never cached). We only have the video id at that point, but ids are
// globally unique, so rebuilding a canonical watch URL from it and
// re-resolving is equivalent to the user pasting the link again.
export async function reResolveById(id: string): Promise<ResolvedStream> {
  return resolveYouTubeAudio(toCanonicalYouTubeUrl(id))
}
