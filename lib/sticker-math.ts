// Shared layout math for the sticker generator — used identically by the
// on-screen live preview (DOM) and the PDF export (canvas), so the two can
// never drift apart. "Cover" semantics: fill the frame, crop overflow,
// same as CSS `object-fit: cover`, plus a user zoom + pan on top.

export interface CoverLayout {
  drawW: number;
  drawH: number;
  x: number;
  y: number;
}

export function computeCoverLayout(args: {
  frameW: number;
  frameH: number;
  imgW: number;
  imgH: number;
  zoom: number;
  offsetXFrac: number; // -1..1, fraction of the available pan range
  offsetYFrac: number; // -1..1
}): CoverLayout {
  const { frameW, frameH, imgW, imgH, zoom, offsetXFrac, offsetYFrac } = args;
  if (!frameW || !frameH || !imgW || !imgH) {
    return { drawW: 0, drawH: 0, x: 0, y: 0 };
  }
  const coverScale = Math.max(frameW / imgW, frameH / imgH);
  const scale = coverScale * Math.max(1, zoom);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const maxOffsetX = Math.max(0, (drawW - frameW) / 2);
  const maxOffsetY = Math.max(0, (drawH - frameH) / 2);
  const clamp = (n: number) => Math.min(1, Math.max(-1, n));
  const x = (frameW - drawW) / 2 + clamp(offsetXFrac) * maxOffsetX;
  const y = (frameH - drawH) / 2 + clamp(offsetYFrac) * maxOffsetY;
  return { drawW, drawH, x, y };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StickerLayout {
  logoFrame: Rect;
  qrFrame: Rect;
  dividerX: number;
  contentTop: number;
  contentBottom: number;
}

/**
 * Frame geometry for the two sticker halves, in whatever unit the caller
 * passes in (inches for the PDF export, pixels for the live preview). Both
 * call sites share this so a gap/border/padding change can never render
 * differently in the preview than in the downloaded PDF.
 */
export function computeStickerLayout(args: {
  width: number;
  height: number;
  padding: number;
  gap: number;
  borderWidth: number;
}): StickerLayout {
  const { width, height, padding, gap, borderWidth } = args;
  const inset = padding + borderWidth;
  const midX = width / 2;
  const top = inset;
  const bottom = height - inset;
  const frameH = Math.max(0, bottom - top);

  const logoRight = Math.max(inset, midX - gap / 2);
  const qrLeft = Math.min(width - inset, midX + gap / 2);

  return {
    logoFrame: { x: inset, y: top, w: Math.max(0, logoRight - inset), h: frameH },
    qrFrame: { x: qrLeft, y: top, w: Math.max(0, width - inset - qrLeft), h: frameH },
    dividerX: midX,
    contentTop: top,
    contentBottom: bottom,
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

/** WCAG relative luminance, 0 (black) .. 1 (white). */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** True when a QR color is light enough on a white background to risk scan failures. */
export function isLowContrastForScanning(hex: string): boolean {
  return relativeLuminance(hex) > 0.28;
}
