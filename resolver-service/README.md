# YouTube resolver service

A tiny, standalone Flask service with one job: given a YouTube URL, run
yt-dlp and return metadata plus a direct, temporary CDN URL for the best
audio-only track.

## Why this is a separate service

The main app (`alkindyTech`, the Next.js project one level up) is deployed
on Vercel. Vercel's serverless functions share an IP pool with thousands of
unrelated tenants, and YouTube's anti-bot system treats that pool with a lot
of suspicion — requests get rejected with "Sign in to confirm you're not a
bot." Running yt-dlp here instead, on a small dedicated host with its own
IP, doesn't eliminate that risk, but it's not shared with everyone else on
Vercel either, which meaningfully reduces how often it happens.

Everything else — Redis caching of resolved URLs, the actual Range-based
audio proxy, the frontend player — stays on Vercel unchanged. Only the
yt-dlp invocation itself lives here. The main app's `lib/services/ytdlp.ts`
is just a thin authenticated HTTP client for this service.

## Endpoints

- `POST /resolve` — body `{ "url": "https://www.youtube.com/watch?v=..." }`,
  requires `Authorization: Bearer <RESOLVER_SECRET>`. Returns
  `{ id, title, thumbnail, duration, url, ext }` or `{ error }`.
- `GET /health` — no auth, just confirms the service is up.

## Required environment variable

- `RESOLVER_SECRET` — any long random string. The service refuses *all*
  `/resolve` requests if this isn't set, rather than running open — without
  it, anyone who finds this service's URL could use it as their own free
  YouTube-audio extractor. Generate one with:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  The exact same value must be set as `RESOLVER_SECRET` in the main app's
  Vercel environment variables.

## Optional environment variable

- `YOUTUBE_COOKIES` — contents of a `cookies.txt` file exported from a real,
  logged-in YouTube session (use a throwaway Google account, not your main
  one — these cookies drive an automated service handling arbitrary public
  requests). Only needed if this host's IP *also* starts getting flagged by
  YouTube's bot-detection; leave unset otherwise. Cookies expire/rotate
  periodically and will need re-exporting if that happens.

## Deploying

This is a plain Dockerfile, so it deploys to any container-based host.
Point the platform at this `resolver-service/` subdirectory (not the repo
root) as the build context/root directory.

**Render** (recommended for simplicity — free tier, connect the GitHub repo
in their dashboard, no CLI needed):
1. New → Web Service → connect this repo.
2. Root Directory: `resolver-service`
3. Runtime: Docker (it'll detect the Dockerfile automatically).
4. Add the `RESOLVER_SECRET` environment variable.
5. Deploy. Render gives you an HTTPS URL like `https://xxx.onrender.com`.
   Your resolve endpoint is `https://xxx.onrender.com/resolve`.

Note: Render's free tier spins down after ~15 minutes of inactivity, so the
first request after a quiet period pays a cold-start penalty (the container
has to boot back up) before yt-dlp even runs. Fly.io or an always-on host
(e.g. an Oracle Cloud "Always Free" VM) avoids this if it becomes annoying,
at the cost of more manual setup.

## Local testing

```
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
RESOLVER_SECRET=dev-secret PORT=8080 .venv/bin/python server.py
```

Or with Docker:
```
docker build -t resolver-service .
docker run -p 8080:8080 -e RESOLVER_SECRET=dev-secret resolver-service
```
