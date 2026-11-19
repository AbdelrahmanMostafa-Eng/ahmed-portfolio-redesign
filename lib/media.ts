import { existsSync } from "node:fs"
import path from "node:path"

/**
 * Photo slots. Drop a file into /public/images with one of these base names
 * (any of .webp, .jpg, .jpeg, .png, .avif) and it appears on the site at the
 * next build — no code changes needed. Until then a drawn visual stands in.
 */
const SLOTS = {
  portrait: "ahmed-portrait",
  matrix: "ahmed-matrix",
  ict: "ict",
} as const

const EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png"]

export type Media = Partial<Record<keyof typeof SLOTS, string>>

function find(base: string) {
  for (const ext of EXTENSIONS) {
    const file = path.join(process.cwd(), "public", "images", base + ext)
    if (existsSync(file)) return `/images/${base}${ext}`
  }
  return undefined
}

export function getMedia(): Media {
  const out: Media = {}
  for (const [key, base] of Object.entries(SLOTS) as [keyof typeof SLOTS, string][]) {
    const src = find(base)
    if (src) out[key] = src
  }
  return out
}
