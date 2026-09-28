"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const GOLD_LIGHT = "#f6d98a"
const GOLD_MID = "#d4a339"
const GOLD_DEEP = "#8a6415"

export function AuthenticProductExperience() {
  const [scannedOn, setScannedOn] = useState<string | null>(null)

  useEffect(() => {
    setScannedOn(
      new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    )
  }, [])

  return (
    <main
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center"
      style={{ backgroundColor: "#0a0806" }}
    >
      {/* Ambient gold vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 38%, rgba(212,163,57,0.20), transparent 65%)",
        }}
        aria-hidden
      />

      {/* Fine paper/foil grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      {/* Slow diagonal light sweep — security-foil feel */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-1/3"
        style={{
          background: "linear-gradient(115deg, transparent, rgba(246,217,138,0.10), transparent)",
        }}
        initial={{ x: "-140%" }}
        animate={{ x: "260%" }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
        aria-hidden
      />

      <motion.div
        className="relative z-10 flex w-full max-w-xs flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
        }}
      >
        {/* Brand mark */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: -12 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-2"
        >
          <Image
            src="/assets/dzLogo.png"
            alt="DZ"
            width={72}
            height={72}
            priority
            className="h-[72px] w-[72px] object-contain"
          />
        </motion.div>

        {/* Seal */}
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative my-4 flex items-center justify-center"
        >
          <div
            className="absolute h-44 w-44 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(212,163,57,0.35), transparent 70%)" }}
            aria-hidden
          />
          <VerifiedSeal />
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.5 }}
          className="mt-2 flex items-center gap-3"
        >
          <span className="h-px w-6" style={{ backgroundColor: `${GOLD_MID}66` }} />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: GOLD_MID }}
          >
            Verified Original
          </span>
          <span className="h-px w-6" style={{ backgroundColor: `${GOLD_MID}66` }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-3 font-serif text-[2.6rem] italic leading-[1.05]"
          style={{
            backgroundImage: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD_MID} 55%, ${GOLD_DEEP})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Authentic.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "#e9dfc9" }}
        >
          This is a genuine, officially issued <span style={{ color: GOLD_LIGHT }}>DZ</span> product.
        </motion.p>

        {/* Scanned date */}
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-[11px] tracking-wide"
          style={{ color: "#8a7a55" }}
        >
          {scannedOn ? `Checked on ${scannedOn}` : " "}
        </motion.p>
      </motion.div>
    </main>
  )
}

function VerifiedSeal() {
  return (
    <svg width="160" height="160" viewBox="0 0 200 200" className="relative">
      <defs>
        <radialGradient id="sealGradient" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="48%" stopColor={GOLD_MID} />
          <stop offset="100%" stopColor={GOLD_DEEP} />
        </radialGradient>
      </defs>

      {/* Rotating dashed ring */}
      <motion.circle
        cx={100}
        cy={100}
        r={92}
        fill="none"
        stroke={GOLD_MID}
        strokeWidth={1.5}
        strokeDasharray="3 7"
        opacity={0.55}
        style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* Seal body */}
      <motion.circle
        cx={100}
        cy={100}
        r={76}
        fill="url(#sealGradient)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 13, delay: 0.25 }}
        style={{ transformOrigin: "100px 100px" }}
      />

      {/* Inner ring detail */}
      <circle cx={100} cy={100} r={64} fill="none" stroke="#0a0806" strokeWidth={1} opacity={0.25} />

      {/* Checkmark */}
      <motion.path
        d="M64 103 L87 126 L138 76"
        fill="none"
        stroke="#0a0806"
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.75, ease: "easeOut" }}
      />
    </svg>
  )
}
