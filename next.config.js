/** @type {import('next').NextConfig} */
const nextConfig = {
  // The bundled yt-dlp binary (bin/yt-dlp_linux) is only ever referenced via
  // a string path passed to execFile, not an import/require — Next.js's
  // static file tracing can't see that reference on its own, so without
  // this the binary would silently get left out of the deployed function
  // and every /api/resolve or /api/stream call would fail with ENOENT in
  // production despite working fine locally (where the whole repo is on
  // disk regardless of tracing).
  outputFileTracingIncludes: {
    "/api/**": ["./bin/**"],
  },
}

module.exports = nextConfig
