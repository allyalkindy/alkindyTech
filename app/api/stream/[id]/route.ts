import { NextResponse } from "next/server"
import { getCachedStream, reResolveById } from "@/lib/services/ytdlp"

export const runtime = "nodejs"
// A cache miss means re-running yt-dlp before the first byte can be
// proxied, and a request for the whole file (no Range header) keeps this
// function alive for as long as that download takes — both can occasionally
// run long. Free/Hobby plans cap this lower than what's requested here
// regardless.
export const maxDuration = 60

// A video id is always exactly 11 URL-safe characters — used to reject
// junk before it ever reaches Redis or yt-dlp.
const ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/

// Proxies the audio for a previously-resolved video, chunk by chunk.
//
// The key trick: we forward the browser's own Range header to YouTube's
// CDN and pass its 206 Partial Content response straight back. That's what
// lets the <audio> element fetch only the next few seconds it needs
// instead of the whole file, and what makes seeking work — we never
// download the full track ourselves, we just relay whichever slice was
// asked for.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!ID_PATTERN.test(id)) {
    return new NextResponse("Invalid video id", { status: 400 })
  }

  let stream = await getCachedStream(id)
  if (!stream) {
    try {
      stream = await reResolveById(id)
    } catch (error) {
      console.error("STREAM_RESOLVE_ERROR:", error)
      return new NextResponse("Video not found or unavailable", { status: 404 })
    }
  }

  const clientRange = req.headers.get("range")
  // YouTube's CDN quietly throttles requests with no Range header to a
  // crawl (a plain GET measured ~7KB/s vs. instant full speed with a
  // Range header) — it's clearly meant to discourage bulk downloading
  // while leaving real seek-and-stream playback fast. So we always send
  // *some* Range upstream, defaulting to "the whole file" when the client
  // didn't ask for a specific slice, and only decide afterwards whether to
  // show the client a 206 or a plain 200.
  const upstreamRange = clientRange ?? "bytes=0-"

  let upstream = await fetch(stream.directUrl, { headers: { Range: upstreamRange } })

  // YouTube's CDN URLs are signed and expire after a few hours. If ours
  // died since it was cached, re-resolve once and retry before giving up.
  if (upstream.status === 403 || upstream.status === 410) {
    stream = await reResolveById(id)
    upstream = await fetch(stream.directUrl, { headers: { Range: upstreamRange } })
  }

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Upstream audio fetch failed", { status: 502 })
  }

  const headers = new Headers()
  headers.set("Content-Type", stream.contentType)
  headers.set("Accept-Ranges", "bytes")
  headers.set("Cache-Control", "no-store") // this is a live proxy, never a cached copy

  if (clientRange) {
    // The client explicitly asked for a byte range (this is what the
    // <audio> element does) — pass partial-content semantics through
    // faithfully so seeking keeps working.
    const contentRange = upstream.headers.get("content-range")
    if (contentRange) headers.set("Content-Range", contentRange)
    const contentLength = upstream.headers.get("content-length")
    if (contentLength) headers.set("Content-Length", contentLength)

    return new NextResponse(upstream.body, { status: upstream.status, headers })
  }

  // The client didn't ask for a range — present this as a normal, full
  // response even though we used "bytes=0-" upstream just to stay fast.
  const contentRange = upstream.headers.get("content-range")
  const totalLength = contentRange?.split("/")[1] ?? upstream.headers.get("content-length")
  if (totalLength) headers.set("Content-Length", totalLength)

  return new NextResponse(upstream.body, { status: 200, headers })
}
