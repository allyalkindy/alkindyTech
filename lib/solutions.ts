import { QrCode, AudioLines, Clapperboard, Youtube, type LucideIcon } from "lucide-react";

export interface Solution {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  status: "live" | "coming-soon";
  href: string;
}

export const solutions: Solution[] = [
  {
    slug: "sticker-generator",
    title: "Sticker Generator",
    tagline: "Logo + link, one clean sticker",
    description:
      "Upload a logo, paste a link, and get a print-ready QR sticker — logo on the left, scannable code on the right. Downloads instantly as a PDF.",
    icon: QrCode,
    status: "live",
    href: "/solutions/sticker-generator",
  },
  {
    slug: "audio-compressor",
    title: "Audio Compressor",
    tagline: "Smaller files, same sound",
    description:
      "Upload an audio file and compress it with the real LAME MP3 encoder — pick your quality, hear the before and after yourself, then download.",
    icon: AudioLines,
    status: "live",
    href: "/solutions/audio-compressor",
  },
  {
    slug: "mp3-to-mp4",
    title: "MP3 to MP4",
    tagline: "Audio + image, one video",
    description:
      "Upload an audio file and a background image and get a real MP4 video — proper H.264/AAC, encoded entirely in your browser. Perfect for YouTube, podcasts, and Reels.",
    icon: Clapperboard,
    status: "live",
    href: "/solutions/mp3-to-mp4",
  },
  {
    slug: "youtube-listener",
    title: "YouTube Listener",
    tagline: "Paste a link, lock your phone, keep listening",
    description:
      "Paste a YouTube link and listen to the audio with real lock-screen controls — play, pause, and seek from your phone's lock screen. Audio streams progressively, nothing is downloaded in full.",
    icon: Youtube,
    status: "live",
    href: "/solutions/youtube-listener",
  },
];
