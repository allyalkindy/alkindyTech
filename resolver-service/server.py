# A tiny, standalone microservice with one job: given a YouTube URL, run
# yt-dlp and hand back metadata plus a direct, temporary CDN URL for the
# best audio-only track.
#
# This exists as a *separate* service (deployed on its own persistent host,
# not on Vercel) because YouTube's anti-bot system treats requests from
# Vercel's shared serverless IP pool with a lot of suspicion ("Sign in to
# confirm you're not a bot"). Running yt-dlp here instead — on a small,
# dedicated host with its own IP — doesn't make that risk disappear, but
# it's not shared with thousands of unrelated Vercel tenants either, which
# meaningfully reduces how often it gets triggered.
#
# The main Next.js app (on Vercel) calls POST /resolve over HTTPS instead of
# spawning yt-dlp itself. Everything else — Redis caching, the actual
# Range-based audio proxying, the frontend — stays on Vercel unchanged;
# only the yt-dlp invocation itself moved.

import json
import os
import subprocess
import tempfile

from flask import Flask, jsonify, request

app = Flask(__name__)

# Required: refuses all requests if unset, rather than silently running
# open. Without this, anyone who finds this service's URL could use it as
# their own free YouTube-audio extractor, burning through this host's free
# tier for something that has nothing to do with our app.
RESOLVER_SECRET = os.environ.get("RESOLVER_SECRET", "")

# Optional: cookies from a real logged-in YouTube session, same mitigation
# used on the Vercel side before this service existed — still useful here
# if bot-detection shows up from this host's IP too. Written once to a temp
# file at startup rather than on every request.
_COOKIES_PATH = None


def _cookies_path():
    global _COOKIES_PATH
    cookies_content = os.environ.get("YOUTUBE_COOKIES")
    if not cookies_content:
        return None
    if _COOKIES_PATH is None:
        fd, path = tempfile.mkstemp(suffix=".txt")
        with os.fdopen(fd, "w") as f:
            f.write(cookies_content)
        _COOKIES_PATH = path
    return _COOKIES_PATH


def is_valid_youtube_url(url: str) -> bool:
    import re

    if not re.match(r"^https?://(www\.|m\.)?(youtube\.com|youtu\.be)/", url):
        return False
    return bool(re.search(r"[a-zA-Z0-9_-]{11}", url))


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


@app.route("/resolve", methods=["POST"])
def resolve():
    if not RESOLVER_SECRET:
        return jsonify({"error": "RESOLVER_SECRET is not configured on this server"}), 500

    auth_header = request.headers.get("Authorization", "")
    if auth_header != f"Bearer {RESOLVER_SECRET}":
        return jsonify({"error": "Unauthorized"}), 401

    body = request.get_json(silent=True) or {}
    url = body.get("url")
    if not url or not isinstance(url, str) or not is_valid_youtube_url(url):
        return jsonify({"error": "A valid YouTube URL is required"}), 400

    info, error = _resolve_with_fallback(url)
    if info is None:
        return jsonify({"error": error or "yt-dlp failed"}), 502

    return jsonify(
        {
            "id": info.get("id"),
            "title": info.get("title"),
            "thumbnail": info.get("thumbnail"),
            "duration": info.get("duration"),
            "url": info.get("url"),
            "ext": info.get("ext"),
        }
    )


# Which YouTube "client" yt-dlp impersonates affects both (a) whether a
# request gets flagged by bot-detection and (b) whether audio-only formats
# are even offered — and which combination currently works shifts over time
# as YouTube and yt-dlp go back and forth (see
# github.com/yt-dlp/yt-dlp/issues/17389 for one concrete, ongoing example:
# the default "tv_downgraded" client started getting rejected with "The
# page needs to be reloaded"). Rather than hardcode one combination that
# will inevitably go stale again, we try a short list in order and use
# whichever one actually returns a usable format for this specific request.
CLIENT_STRATEGIES = [
    "player_client=-tv_downgraded",  # default set minus the currently-broken client
    "",  # yt-dlp's own unmodified default
    "player_client=tv_simply",
    "player_client=web_safari,web_embedded",
]


def _resolve_with_fallback(url):
    cookies_path = _cookies_path()
    last_error = None

    for strategy in CLIENT_STRATEGIES:
        extractor_args = "youtube:skip=hls"
        if strategy:
            extractor_args += ";" + strategy

        cmd = [
            "yt-dlp",
            "--dump-json",
            "--no-playlist",
            "--no-warnings",
            "--extractor-args", extractor_args,
            # m4a (AAC) plays natively on every major browser, including
            # iOS Safari, unlike webm/opus.
            "-f", "bestaudio[ext=m4a]/bestaudio",
        ]
        if cookies_path:
            cmd += ["--cookies", cookies_path]
        cmd.append(url)

        try:
            # Short per-attempt timeout since we may make several attempts —
            # a real success normally takes a few seconds, not this long.
            # Kept tight (4 strategies x 10s = 40s worst case) so the whole
            # chain stays comfortably under Vercel's function time limit.
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        except subprocess.TimeoutExpired:
            last_error = f"yt-dlp timed out (player_client={strategy or 'default'})"
            continue

        if result.returncode != 0:
            last_error = result.stderr.strip() or "yt-dlp failed"
            continue

        try:
            info = json.loads(result.stdout)
        except json.JSONDecodeError:
            last_error = "yt-dlp returned unexpected output"
            continue

        if info.get("url"):
            return info, None

        last_error = "yt-dlp returned no usable format"

    return None, last_error


if __name__ == "__main__":
    # Local/dev only — the Dockerfile runs this under waitress instead.
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
