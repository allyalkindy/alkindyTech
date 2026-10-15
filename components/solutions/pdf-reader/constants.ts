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
