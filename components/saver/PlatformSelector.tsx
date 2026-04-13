"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { platform } from "@/lib/types/saverTypes";
import { ChevronDown, Youtube, Instagram, Music2, Share2, Check } from "lucide-react";

type Props = {
  platforms: platform[];
  selected: string;
  onSelect: (id: string) => void;
};

const iconMap: Record<string, any> = {
  tiktok: Music2,
  instagram: Instagram,
  youtube: Youtube,
  default: Share2,
};

export default function PlatformSelector({ platforms, selected, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPlatform = platforms.find((p) => p.id === selected) || platforms[0];
  const SelectedIcon = iconMap[selectedPlatform.id.toLowerCase()] || iconMap.default;

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    // Use both for cross-device compatibility
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick); 
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  return (
    // Z-40 ensures it is UNDER the Nav (z-50) but ABOVE the main content
    <div className="relative w-full max-w-md mx-auto mb-10 px-4 z-40" ref={containerRef}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <p className="text-[14px] font-black text-slate-100 uppercase tracking-[0.3em]">
         Choose The Platform
        </p>
      </div>

      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation(); // Stop event from bubbling up to parents
            setIsOpen(!isOpen);
          }}
          className={`w-full relative flex items-center justify-between gap-3 p-4 
            bg-slate-900/60 backdrop-blur-xl border-2 transition-all duration-300 shadow-xl rounded-2xl
            ${isOpen ? 'border-blue-500/50 shadow-blue-500/10' : 'border-slate-800'}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <SelectedIcon size={20} className="text-blue-400" />
            </div>
            <span className="font-bold text-slate-200 tracking-tight">{selectedPlatform.name}</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute top-full left-0 right-0 mt-3 p-2 
                bg-slate-900/95 backdrop-blur-2xl border-2 border-slate-800 
                rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
            >
              <div className="grid gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                {platforms.map((p) => {
                  const isSelected = selected === p.id;
                  const Icon = iconMap[p.id.toLowerCase()] || iconMap.default;

                  return (
                    <button
                      key={p.id}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        onSelect(p.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all
                        ${isSelected ? "bg-blue-600/20" : "hover:bg-white/5"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isSelected ? "text-blue-400" : "text-slate-500"} />
                        <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-300"}`}>
                          {p.name}
                        </span>
                      </div>
                      {isSelected && <Check size={16} className="text-blue-400" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}