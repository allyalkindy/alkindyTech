"use client";

import { useState } from "react";
import { isValidTikTokUrl } from "@/lib/saverUtils/utils";
import { SAVER_API_URL } from "@/lib/constants";
import TikTokSvg from "../ui/TikTokSvg";
import { tikTokSaverResponse } from "@/lib/types/saverTypes";

export default function TikTokSaverCard() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<tikTokSaverResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [choice, setChoice] = useState<"video" | "audio" | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const postUrlToBackend = async () => {
    setError("");

    if (!isValidTikTokUrl(url)) {
      setError("Please enter a valid TikTok link");
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);
    setProgress(30);

    try {
      const res = await fetch(SAVER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      setProgress(70);

      const data = await res.json();

      if (!data || !data.videoNoWM) {
        throw new Error("Invalid response");
      }

      setResult(data);
      setProgress(100);
    } catch (err) {
      setError("Failed to fetch video. Please try another link.");
    }

    setLoading(false);
  };

  const pasteClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setUrl(text);
    setResult(null);
    setError("");
  };

  const clearInput = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  const handleDownload = async (fileUrl: string, filename: string) => {
    setDownloading(true);
    setProgress(0);

    try {
      const response = await fetch(fileUrl);

      if (!response.body) throw new Error("Stream not supported");

      const reader = response.body.getReader();
      const contentLength = Number(response.headers.get("Content-Length"));

      let receivedLength = 0;
      const chunks: BlobPart[] = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        if (value) {
          chunks.push(value);
          receivedLength += value.length;

          if (contentLength) {
            const percent = Math.round((receivedLength / contentLength) * 100);
            setProgress(percent);
          }
        }
      }

      const blob = new Blob(chunks);

      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);

      a.click();

      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      setTimeout(() => {
        setDownloading(false);
        setProgress(0);
      }, 600);
    } catch (err) {
      setDownloading(false);
      setError("Download failed");
    }
  };

  // async function handleDownload(fileUrl: string, filename: string) {
  //   setDownloading(true)
  //   setProgress(0)

  //   try {
  //   const response = await fetch(fileUrl)

  //   if (!response.body) throw new Error("Streaming not supported")

  //   const fileHandle = await window.showSaveFilePicker({
  //     suggestedName: filename
  //   })

  //   const writable = await fileHandle.createWritable()

  //   const reader = response.body.getReader()

  //   let receivedLength = 0
  //   const contentLength = Number(response.headers.get("Content-Length"))

  //   while (true) {
  //     const { done, value } = await reader.read()

  //     if (done) break

  //     await writable.write(value)

  //     receivedLength += value.length

  //     if (contentLength) {
  //       const percent = Math.round((receivedLength / contentLength) * 100)
  //       setProgress(percent)
  //     }
  //   }

  //   await writable.close()

  //   setTimeout(() => {
  //     setDownloading(false)
  //     setProgress(0)
  //   }, 600)

  // } catch (err) {
  //   setDownloading(false)
  //   setError("Download failed")
  // }
  // }

  return (
    <>
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
              Your {choice} is being downloaded
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="text-white/70 text-sm">{progress}%</div>
          </div>
        </div>
      )}

      <div className="relative max-w-3xl w-full px-6">
        <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          {/* Header */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <TikTokSvg className="h-8 w-8" viewBox="0 0 48 48" />

            <div className="text-white text-lg font-semibold">
              TikTok Downloader
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-3">
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
                setUrl(e.target.value);
                setResult(null);
                setError("");
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
              onClick={postUrlToBackend}
              className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
            >
              {loading ? "Processing..." : "Download"}
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center mb-4">{error}</div>
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
                  onClick={() => {
                    handleDownload(result.videoNoWM, "tiktok-video.mp4");
                    setChoice("video");
                  }}
                  className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition"
                >
                  Download Video
                </button>

                <button
                  onClick={() => {
                    handleDownload(result.audio, "tiktok-audio.mp3");
                    setChoice("audio");
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition"
                >
                  Download Audio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
