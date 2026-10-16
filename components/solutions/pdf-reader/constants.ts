export const MAX_PDF_BYTES = 150 * 1024 * 1024 // 150MB

// How many pages ahead/behind the current one get rasterized eagerly, so
// flipping forward or back a page or two never has to wait on a render.
export const RENDER_WINDOW_BEHIND = 2
export const RENDER_WINDOW_AHEAD = 4

// Single-page dimensions (px) the book is sized between — react-pageflip's
// "stretch" mode picks whatever fits the container within these bounds
// while preserving the PDF's own aspect ratio.
export const MIN_PAGE_WIDTH = 240
export const MAX_PAGE_WIDTH = 560

// Applied as a CSS transform on top of react-pageflip's own layout, rather
// than changing the width/height props it's given — that keeps the
// library's internal drag/flip math (which reads real DOM rects) correctly
// calibrated at any zoom level instead of going out of sync with a resized
// book.
export const MIN_ZOOM = 0.75
export const MAX_ZOOM = 2
export const ZOOM_STEP = 0.25
