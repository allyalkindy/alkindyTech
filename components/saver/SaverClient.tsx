"use client"

import { useState } from "react"

export default function SaverClient() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const isValidTikTokUrl = (link: string) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/.+/i
    return regex.test(link)
  }

  const handleDownload = async () => {
    setError("")

    if (!isValidTikTokUrl(url)) {
      setError("Please enter a valid TikTok link")
      setResult(null)
      return
    }

    setLoading(true)
    setResult(null)
    setProgress(30)

    try {
      const res = await fetch("/api/saver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      setProgress(70)

      const data = await res.json()

      if (!data || !data.videoNoWM) {
        throw new Error("Invalid response")
      }

      setResult(data)
      setProgress(100)
    } catch (err) {
      setError("Failed to fetch video. Please try another link.")
    }

    setLoading(false)
  }

  const pasteClipboard = async () => {
    const text = await navigator.clipboard.readText()
    setUrl(text)
    setResult(null)
    setError("")
  }

  const clearInput = () => {
    setUrl("")
    setResult(null)
    setError("")
  }

  const forceDownload = async (fileUrl: string, filename: string) => {
    setDownloading(true)
    setProgress(0)

    try {
      const response = await fetch(fileUrl)

      if (!response.body) throw new Error("Stream not supported")

      const reader = response.body.getReader()
      const contentLength = Number(response.headers.get("Content-Length"))

      let receivedLength = 0
      const chunks: BlobPart[] = []

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        if (value) {
          chunks.push(value)
          receivedLength += value.length

          if (contentLength) {
            const percent = Math.round((receivedLength / contentLength) * 100)
            setProgress(percent)
          }
        }
      }

      const blob = new Blob(chunks)

      const blobUrl = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)

      a.click()

      a.remove()
      window.URL.revokeObjectURL(blobUrl)

      setTimeout(() => {
        setDownloading(false)
        setProgress(0)
      }, 600)

    } catch (err) {
      setDownloading(false)
      setError("Download failed")
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 pt-24 pb-24 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-[160px] rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[160px] rounded-full bottom-0 right-0"></div>

      {/* DOWNLOAD PROGRESS MODAL */}
      {downloading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          <div className="bg-white/[0.06] border border-white/10 backdrop-blur-xl rounded-2xl p-8 w-[320px] shadow-2xl text-center">

            <h3 className="text-white text-lg font-semibold mb-4">
              Downloading...
            </h3>

            <p className="text-white/60 text-sm mb-5">
              Your video is being downloaded
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="text-white/70 text-sm">
              {progress}%
            </div>

          </div>

        </div>
      )}

      <div className="relative max-w-3xl w-full px-6">

        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">

          {/* Header */}
          <div className="flex justify-center items-center gap-3 mb-6">

            <svg className="w-8 h-8" viewBox="0 0 48 48">
              <path
                d="M34 16c-2.6-1.5-4.3-4.2-4.3-7.2h-6.3v24.2c0 2.7-2.2 4.9-4.9 4.9s-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9c.6 0 1.2.1 1.7.3V22c-.6-.1-1.2-.2-1.7-.2-6 0-10.9 4.9-10.9 10.9S12.5 43.6 18.5 43.6 29.4 38.7 29.4 32.7V20.7c2.5 1.8 5.6 2.9 8.8 2.9v-7.6c-1.5 0-2.9-.4-4.2-1z"
                fill="#FE2C55"
              />
              <path
                d="M32.5 14.5c-2.1-1.4-3.4-3.7-3.4-6.2h-4.7v23c0 2.5-2 4.5-4.5 4.5S15.4 33.8 15.4 31.3s2-4.5 4.5-4.5c.6 0 1.1.1 1.6.3v-4.8c-.5-.1-1-.2-1.6-.2-5.4 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8 9.8-4.4 9.8-9.8V19.6c2.3 1.6 5.1 2.6 8 2.6v-5.9c-1.3 0-2.5-.3-3.6-.8z"
                fill="#25F4EE"
              />
            </svg>

            <div className="text-white text-lg font-semibold">
              TikTok Downloader
            </div>

          </div>

          <h1 className="text-4xl font-bold text-center text-white mb-3">
            Download TikTok Videos
          </h1>

          <p className="text-center text-white/60 mb-8">
            Save TikTok videos without watermark instantly
          </p>

          {/* Input */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">

            <input
              type="text"
              placeholder="Paste TikTok link..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setResult(null)
                setError("")
              }}
              className="flex-1 px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={pasteClipboard}
              className="px-4 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              Paste
            </button>

            <button
              onClick={clearInput}
              className="px-4 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              Clear
            </button>

            <button
              onClick={handleDownload}
              className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
            >
              {loading ? "Processing..." : "Download"}
            </button>

          </div>

          {error && (
            <div className="text-red-400 text-sm text-center mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="w-full bg-white/10 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {result && (
            <div className="mt-10 text-center">

              <img
                src={result.thumbnail}
                alt="thumbnail"
                className="rounded-xl mx-auto mb-6 w-72 shadow-xl border border-white/10"
              />

              <h3 className="text-lg text-white font-semibold mb-4">
                {result.title}
              </h3>

              <div className="flex flex-wrap justify-center gap-4">

                <button
                  onClick={() =>
                    forceDownload(result.videoNoWM, "tiktok-video.mp4")
                  }
                  className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition"
                >
                  Download Video
                </button>

                <button
                  onClick={() =>
                    forceDownload(result.audio, "tiktok-audio.mp3")
                  }
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition"
                >
                  Download Audio
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  )
}