"use client";
import TikTokSaverCard from "../../../components/saver/TikTokSaverCard";
import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { platform } from "@/lib/types/saverTypes";
import { useState } from "react";
import SaverRenderer from "@/components/saver/SaverRender";
import PlatformSelector from "@/components/saver/PlatformSelector";
import { platforms } from "@/lib/platforms/platforms";

export default function Page() {
  const [platform, setPlatform] = useState<string>("tiktok");
  return (
    <>
      <Navigation />
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 pt-32 pb-24 overflow-hidden">
        <PlatformSelector
          platforms={platforms}
          selected={platform}
          onSelect={setPlatform}
        />
        <SaverRenderer platform={platform} />
      </section>
      <Footer />
    </>
  );
}
