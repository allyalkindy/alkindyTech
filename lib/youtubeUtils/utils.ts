// Recognizes the handful of URL shapes YouTube uses for a single video and
// pulls out the 11-character video id — that id is all we actually need,
// everything else (playlists, timestamps, tracking params) is ignored.
const YOUTUBE_ID_PATTERNS = [
  /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
]

export function extractYouTubeId(link: string): string | null {
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = pattern.exec(link)
    if (match) return match[1]
  }
  return null
}

export function isValidYouTubeUrl(link: string): boolean {
  if (!/^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(link)) {
    return false
  }
  return extractYouTubeId(link) !== null
}

// Video ids are globally unique, so no matter how the user originally
// pasted the link (youtu.be, /shorts/, extra playlist params, ...) this
// canonical form always resolves the same video. Used when we only have
// the id on hand (e.g. re-resolving an expired stream URL).
export function toCanonicalYouTubeUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}
