import { NextResponse } from "next/server"
import { ratelimit } from "@/lib/services/redisRateLimiter"
import { isValidYouTubeUrl } from "@/lib/youtubeUtils/utils"
import { resolveYouTubeAudio } from "@/lib/services/ytdlp"

export const runtime = "nodejs"
// resolveYouTubeAudio() calls out to the resolver-service over HTTPS (see
// lib/services/ytdlp.ts) rather than running yt-dlp here — that call can
// occasionally take a while, so this asks Vercel for more headroom.
// Free/Hobby plans cap this lower than what's requested here regardless.
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    // A. Rate limiting — this is a public, no-sign-in endpoint that shells
    // out to yt-dlp per request, so it needs a cost guard against abuse.
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
    const { success, limit, reset } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Try again in a few seconds." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      )
    }

    // B. Input validation
    const { url } = await req.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "A YouTube URL is required" }, { status: 400 })
    }
    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json({ error: "That doesn't look like a YouTube link" }, { status: 400 })
    }

    // C. Resolve metadata + the best audio-only stream via yt-dlp, caching
    // the direct CDN URL server-side so /api/stream doesn't re-run yt-dlp
    // on every chunk request.
    const resolved = await resolveYouTubeAudio(url)

    // D. Only return what the player needs — the direct CDN URL stays on
    // the server and is only ever used by /api/stream, never exposed to
    // the client directly.
    return NextResponse.json({
      id: resolved.id,
      title: resolved.title,
      thumbnail: resolved.thumbnail,
      duration: resolved.duration,
    })
  } catch (error) {
    console.error("RESOLVE_ERROR:", error)
    return NextResponse.json(
      { error: "Couldn't read that video. It may be private, age-restricted, or unavailable." },
      { status: 502 },
    )
  }
}
