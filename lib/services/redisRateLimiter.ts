import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 1. Initialize Rate Limiter (Move these to .env)
// Exported so other server-side code (e.g. the YouTube Listener's stream
// cache) can share this same Redis connection instead of opening another.
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  
  // Allow 5 requests per 10 seconds per IP
  export const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    analytics: true,
  });
  