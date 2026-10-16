import type { Metadata } from "next";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { PdfReaderExperience } from "@/components/solutions/pdf-reader/experience";

export const metadata: Metadata = {
  title: "PDF Reader",
  description:
    "Upload a PDF and read it like an actual book — a real page-turn animation, two pages side by side on a big screen, one at a time on your phone. Nothing is uploaded anywhere.",
  alternates: {
    canonical: "/solutions/pdf-reader",
  },
};

export default function PdfReaderPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <PdfReaderExperience />
      <Footer />
    </main>
  );
}
