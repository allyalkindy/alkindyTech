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

    cmd = [
        "yt-dlp",
        "--dump-json",
        "--no-playlist",
        "--no-warnings",
        # Same optimization as the original Vercel implementation: the
        # audio-only format we pick already comes from the initial player
        # response, so fetching the separate HLS manifest is wasted work.
        "--extractor-args", "youtube:skip=hls",
        # m4a (AAC) plays natively on every major browser, including iOS
        # Safari, unlike webm/opus.
        "-f", "bestaudio[ext=m4a]/bestaudio",
    ]
    cookies_path = _cookies_path()
    if cookies_path:
        cmd += ["--cookies", cookies_path]
    cmd.append(url)

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=25,
        )
    except subprocess.TimeoutExpired:
        return jsonify({"error": "yt-dlp timed out"}), 504

    if result.returncode != 0:
        message = result.stderr.strip() or "yt-dlp failed"
        return jsonify({"error": message}), 502

    try:
        info = json.loads(result.stdout)
    except json.JSONDecodeError:
        return jsonify({"error": "yt-dlp returned unexpected output"}), 502

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


if __name__ == "__main__":
    # Local/dev only — the Dockerfile runs this under waitress instead.
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
