import { NextResponse } from "next/server";
import { tikTokSaverApi } from "@/lib/constants";
import {ratelimit} from  "@/lib/services/redisRateLimiter"
import { isValidTikTokUrl } from "@/lib/saverUtils/utils";




export async function POST(req: Request) {
  try {
    // A. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset } = await ratelimit.limit(ip);

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
      );
    }

    // B. Input Extraction & Validation
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // C. Server-Side Regex Gate
    if (!isValidTikTokUrl(url)) {
      return NextResponse.json(
        { error: "Invalid TikTok URL format" },
        { status: 400 },
      );
    }

    // D. Fetch with Timeout (Veteran move: don't let 3rd party APIs hang your server)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const api = `${tikTokSaverApi}?url=${encodeURIComponent(url)}`;

    const response = await fetch(api, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Downloader service is temporarily unavailable" },
        { status: 503 },
      );
    }

    const data = await response.json();

    if (!data?.data) {
      return NextResponse.json(
        { error: "Video not found or private" },
        { status: 404 },
      );
    }

    // E. Clean Response Mapping
    return NextResponse.json({
      title: data.data.title,
      thumbnail: data.data.cover,
      videoNoWM: data.data.play,
      audio: data.data.music,
    });
  } catch (error: any) {
    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    console.error("SAVER_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
