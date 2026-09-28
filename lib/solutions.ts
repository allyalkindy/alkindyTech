import { QrCode, type LucideIcon } from "lucide-react";

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
];
