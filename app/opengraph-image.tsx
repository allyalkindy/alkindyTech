import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "alkindyTech — Ally M. Said, Web Developer & Software Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#1c1712",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(196,92,42,0.35) 0%, rgba(28,23,18,0) 45%), radial-gradient(circle at 85% 85%, rgba(87,110,79,0.3) 0%, rgba(28,23,18,0) 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 34, fontStyle: "italic", color: "#d97a45" }}>alkindy</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: "#f6f1e6" }}>Tech</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: "#f6f1e6",
              lineHeight: 1.2,
              maxWidth: 980,
            }}
          >
            I turn business problems into working software.
          </span>
          <span style={{ fontSize: 26, color: "#d97a45", marginTop: 28 }}>
            Ally M. Said — Web Developer · React · Next.js · TypeScript
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
