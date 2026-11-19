"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Small dot-matrix animations that sit above each section: ink squares on paper,
 * soft fades between frames. Every scene is procedural, so it stays crisp at any
 * pixel density. Animations only run while visible and stay still for visitors
 * who prefer reduced motion.
 */

export type PixelScene = "terminal" | "network" | "chip" | "neural" | "clock" | "badge" | "chat" | "orbit" | "bars" | "signal"

class Grid {
  v: Float32Array
  constructor(
    public w: number,
    public h: number,
  ) {
    this.v = new Float32Array(w * h)
  }
  clear() {
    this.v.fill(0)
  }
  /** Brightest value wins. */
  set(x: number, y: number, a: number) {
    const xi = Math.round(x)
    const yi = Math.round(y)
    if (xi < 0 || yi < 0 || xi >= this.w || yi >= this.h || a <= 0) return
    const i = yi * this.w + xi
    if (a > this.v[i]) this.v[i] = Math.min(1, a)
  }
  /** Overwrites (for details on top of a shape). */
  put(x: number, y: number, a: number) {
    const xi = Math.round(x)
    const yi = Math.round(y)
    if (xi < 0 || yi < 0 || xi >= this.w || yi >= this.h) return
    this.v[yi * this.w + xi] = Math.max(0, Math.min(1, a))
  }
  line(x0: number, y0: number, x1: number, y1: number, a: number, frac = 1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2
    const m = Math.round(n * frac)
    for (let i = 0; i <= m; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, a)
  }
  rect(x0: number, y0: number, x1: number, y1: number, a: number) {
    for (let x = x0; x <= x1; x++) {
      this.set(x, y0, a)
      this.set(x, y1, a)
    }
    for (let y = y0; y <= y1; y++) {
      this.set(x0, y, a)
      this.set(x1, y, a)
    }
  }
  disc(cx: number, cy: number, r: number, a: number) {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) this.set(x, y, a)
  }
  ring(cx: number, cy: number, r: number, a: number, rx = 1) {
    const n = Math.ceil(r * 8)
    for (let i = 0; i < n; i++) {
      const th = (i / n) * Math.PI * 2
      this.set(cx + Math.cos(th) * r * rx, cy + Math.sin(th) * r, a)
    }
  }
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const rnd = (i: number) => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return s - Math.floor(s)
}
/** Point at fraction f along a polyline. */
const along = (pts: number[][], f: number) => {
  const segs = pts.length - 1
  const s = Math.min(segs - 1, Math.floor(f * segs))
  const k = f * segs - s
  return [pts[s][0] + (pts[s + 1][0] - pts[s][0]) * k, pts[s][1] + (pts[s + 1][1] - pts[s][1]) * k]
}

type Scene = { w: number; h: number; rate?: number; still: number; draw: (t: number, g: Grid) => void }

/* Network nodes and links, shared by the scene */
const NET_NODES = [
  [3, 3],
  [10, 2],
  [17, 4],
  [6, 8],
  [14, 9],
  [2, 12],
  [10, 13],
  [18, 12],
]
const NET_LINKS = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [1, 4],
  [2, 4],
  [3, 5],
  [3, 6],
  [4, 6],
  [4, 7],
  [5, 6],
  [6, 7],
]

/* Chip traces: from the package edge out to the canvas edge */
const CHIP_TRACES = [
  [[6, 5], [3, 5], [3, 2], [0, 2]],
  [[6, 8], [1, 8]],
  [[6, 10], [4, 10], [4, 13], [0, 13]],
  [[14, 5], [17, 5], [17, 1], [20, 1]],
  [[14, 8], [20, 8]],
  [[14, 10], [16, 10], [16, 14], [20, 14]],
  [[9, 3], [9, 0]],
  [[12, 3], [12, 1], [15, 1]],
  [[9, 12], [9, 15]],
  [[11, 12], [11, 14], [7, 14]],
]

const NEURAL_LAYERS = [
  [2, 6, 10],
  [1.5, 4.5, 7.5, 10.5],
  [3, 6, 9],
  [4.5, 7.5],
]

const SCENES: Record<PixelScene, Scene> = {
  /* A prompt types three lines, the cursor blinks, the screen clears */
  terminal: {
    w: 21,
    h: 12,
    rate: 22,
    still: 3.2,
    draw(t, g) {
      const P = 6.4
      const p = t % P
      const A = 1 - clamp01((p - 5.9) / 0.5)
      // prompt chevron
      g.set(1, 1, 0.9 * A)
      g.set(2, 2, 0.9 * A)
      g.set(1, 3, 0.9 * A)
      const rows = [2, 6, 10]
      const lens = [14, 11, 8]
      let typed = Math.floor(clamp01(p / 4.4) * (lens[0] + lens[1] + lens[2]))
      let cx = 5
      let cy = 2
      for (let r = 0; r < rows.length; r++) {
        const n = Math.min(lens[r], typed)
        typed -= n
        const y = rows[r]
        const x0 = r === 0 ? 5 : 1
        for (let i = 0; i < n; i++) {
          const gap = rnd(r * 31 + i * 7) > 0.78
          if (!gap) {
            g.set(x0 + i, y, (r === 0 ? 0.85 : 0.55) * A)
            if (r === 0 && rnd(i * 3.3) > 0.55) g.set(x0 + i, y - 1, 0.35 * A)
          }
        }
        if (n > 0 || r === 0) {
          cx = x0 + n
          cy = y
        }
        if (n < lens[r]) break
      }
      const blink = Math.floor(t * 2.6) % 2 === 0
      if (blink) {
        g.set(cx, cy, 0.95 * A)
        g.set(cx, cy - 1, 0.95 * A)
      }
    },
  },

  /* Nodes with packets travelling along the links */
  network: {
    w: 21,
    h: 16,
    rate: 16,
    still: 1.7,
    draw(t, g) {
      for (const [a, c] of NET_LINKS) {
        const [x0, y0] = NET_NODES[a]
        const [x1, y1] = NET_NODES[c]
        g.line(x0, y0, x1, y1, 0.16)
      }
      NET_LINKS.forEach(([a, c], i) => {
        const speed = 0.35 + rnd(i * 4.1) * 0.35
        let f = (t * speed + rnd(i * 9.7)) % 1
        if (i % 2) f = 1 - f
        const [x0, y0] = NET_NODES[a]
        const [x1, y1] = NET_NODES[c]
        g.set(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, 0.95)
      })
      NET_NODES.forEach(([x, y], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.3)
        g.set(x, y, 0.75 + 0.25 * pulse)
        if (pulse > 0.7) {
          g.set(x + 1, y, 0.3)
          g.set(x - 1, y, 0.3)
          g.set(x, y + 1, 0.3)
          g.set(x, y - 1, 0.3)
        }
      })
    },
  },

  /* A processor with signals running out along its traces */
  chip: {
    w: 21,
    h: 16,
    rate: 18,
    still: 1.1,
    draw(t, g) {
      // package
      g.rect(6, 3, 14, 12, 0.85)
      for (let y = 4; y <= 11; y++) for (let x = 7; x <= 13; x++) g.set(x, y, 0.07)
      // die
      const glow = 0.45 + 0.25 * Math.sin(t * 3)
      g.rect(8, 5, 12, 10, glow)
      g.set(10, 7, glow + 0.2)
      g.set(10, 8, glow + 0.2)
      // traces
      CHIP_TRACES.forEach((pts, i) => {
        for (let s = 0; s < pts.length - 1; s++) g.line(pts[s][0], pts[s][1], pts[s + 1][0], pts[s + 1][1], 0.2)
        const f = (t * 0.55 + rnd(i * 5.3)) % 1
        const [x, y] = along(pts, f)
        g.set(x, y, 0.95)
        const [bx, by] = along(pts, Math.max(0, f - 0.08))
        g.set(bx, by, 0.5)
      })
    },
  },

  /* A small neural network: an activation wave passes left to right */
  neural: {
    w: 21,
    h: 13,
    rate: 14,
    still: 1.6,
    draw(t, g) {
      const xs = [2, 8, 13, 18]
      const wave = (t * 1.1) % 5.2
      for (let l = 0; l < NEURAL_LAYERS.length - 1; l++)
        for (const ya of NEURAL_LAYERS[l])
          for (const yb of NEURAL_LAYERS[l + 1]) {
            const hot = clamp01(1 - Math.abs(wave - (l + 0.5)) * 1.4)
            g.line(xs[l], ya, xs[l + 1], yb, 0.1 + 0.32 * hot)
          }
      NEURAL_LAYERS.forEach((layer, l) =>
        layer.forEach((y, i) => {
          const on = clamp01(1 - Math.abs(wave - l) * 1.2) * (0.55 + 0.45 * rnd(l * 7 + i + Math.floor(t * 1.1 / 5.2) * 3))
          g.set(xs[l], y, 0.45 + 0.5 * on)
          if (on > 0.5) {
            g.set(xs[l] - 1, y, 0.3 * on)
            g.set(xs[l] + 1, y, 0.3 * on)
          }
        }),
      )
    },
  },

  /* Clock face — minutes race, hours follow */
  clock: {
    w: 15,
    h: 15,
    rate: 20,
    still: 2.2,
    draw(t, g) {
      const c = 7
      g.ring(c, c, 6.3, 0.35)
      for (let i = 0; i < 12; i++) {
        const th = (i / 12) * Math.PI * 2
        g.set(c + Math.cos(th) * 5.2, c + Math.sin(th) * 5.2, i % 3 === 0 ? 0.85 : 0.3)
      }
      const m = t * 1.4 - Math.PI / 2
      const h = t * 0.12 - Math.PI / 2 + 1.2
      g.line(c, c, c + Math.cos(m) * 4.6, c + Math.sin(m) * 4.6, 0.85)
      g.line(c, c, c + Math.cos(h) * 3, c + Math.sin(h) * 3, 0.95)
      g.set(c, c, 1)
    },
  },

  /* A shield; the check mark draws itself, then a glint */
  badge: {
    w: 15,
    h: 16,
    rate: 16,
    still: 2.6,
    draw(t, g) {
      const P = 4.6
      const p = t % P
      const half = (y: number) => (y < 2 ? 3.5 + y : y <= 8 ? 5.5 : 5.5 * (1 - (y - 8) / 6.5))
      const inside = (x: number, y: number) => y >= 1 && y <= 14 && Math.abs(x - 7) <= half(y)
      for (let y = 0; y < g.h; y++)
        for (let x = 0; x < g.w; x++) {
          if (!inside(x, y)) continue
          const edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)
          g.set(x, y, edge ? 0.85 : 0.06)
        }
      const k = ease(clamp01((p - 0.4) / 1.1))
      if (k > 0) {
        const len1 = Math.min(1, k * 2.4)
        g.line(4, 8, 6, 10, 0.95, len1)
        if (k > 0.42) g.line(6, 10, 10, 5, 0.95, clamp01((k - 0.42) / 0.58))
      }
      const glint = p - 2.1
      if (glint > 0 && glint < 0.9) {
        const gx = 2 + glint * 14
        for (let y = 1; y < 15; y++) {
          const x = gx - y * 0.5
          if (inside(x, y)) g.set(x, y, 0.5)
        }
      }
    },
  },

  /* Someone is typing… and a reply arrives */
  chat: {
    w: 21,
    h: 14,
    rate: 18,
    still: 2.8,
    draw(t, g) {
      const P = 6
      const p = t % P
      const A = 1 - clamp01((p - 5.5) / 0.5)
      // first bubble
      const a1 = clamp01(p / 0.4) * A
      for (let x = 2; x <= 11; x++) {
        g.set(x, 1, 0.8 * a1)
        g.set(x, 6, 0.8 * a1)
      }
      for (let y = 2; y <= 5; y++) {
        g.set(1, y, 0.8 * a1)
        g.set(12, y, 0.8 * a1)
      }
      g.set(3, 7, 0.8 * a1)
      g.set(2, 8, 0.8 * a1)
      if (p < 2.4) {
        for (let i = 0; i < 3; i++) {
          const bounce = Math.sin(t * 7 - i * 0.9) > 0.3 ? -1 : 0
          g.set(4 + i * 2.5, 3.5 + bounce, 0.9 * a1)
        }
      } else {
        const k = clamp01((p - 2.4) / 0.5)
        g.line(3, 3, 10, 3, 0.6 * a1, k)
        g.line(3, 4, 7, 4, 0.6 * a1, k)
      }
      // reply bubble
      const a2 = clamp01((p - 2.9) / 0.4) * A
      if (a2 > 0) {
        for (let x = 9; x <= 18; x++) {
          g.set(x, 8, 0.9 * a2)
          g.set(x, 12, 0.9 * a2)
        }
        for (let y = 9; y <= 11; y++) {
          g.set(8, y, 0.9 * a2)
          g.set(19, y, 0.9 * a2)
        }
        for (let y = 9; y <= 11; y++) for (let x = 9; x <= 18; x++) g.set(x, y, 0.12 * a2)
        g.set(18, 13, 0.9 * a2)
        g.line(10, 10, 10 + 7 * clamp01((p - 3.3) / 0.6), 10, 0.85 * a2)
      }
    },
  },

  /* A planet, its ring and a satellite with a fading trail */
  orbit: {
    w: 23,
    h: 15,
    rate: 20,
    still: 1.3,
    draw(t, g) {
      const cx = 11
      const cy = 7
      // stars
      for (let i = 0; i < 9; i++) {
        const tw = 0.5 + 0.5 * Math.sin(t * 2 + i * 2.3)
        g.set(rnd(i * 3.7) * 23, rnd(i * 8.1) * 15, 0.1 + 0.15 * tw)
      }
      g.disc(cx, cy, 2.6, 0.82)
      g.put(cx - 1, cy - 1, 0.45)
      const n = 64
      for (let i = 0; i < n; i++) {
        const th = (i / n) * Math.PI * 2
        const x = cx + Math.cos(th) * 9.5
        const y = cy + Math.sin(th) * 3.2
        const behind = Math.sin(th) < 0 && Math.abs(x - cx) < 2.8
        if (!behind) g.set(x, y, 0.2)
      }
      for (let k = 0; k < 7; k++) {
        const th = t * 1.3 - k * 0.12
        const x = cx + Math.cos(th) * 9.5
        const y = cy + Math.sin(th) * 3.2
        const behind = Math.sin(th) < 0 && Math.abs(x - cx) < 2.8
        if (!behind) g.set(x, y, k === 0 ? 1 : 0.6 * (1 - k / 7))
      }
    },
  },

  /* Bars climb to their marks, one after another */
  bars: {
    w: 19,
    h: 14,
    rate: 16,
    still: 3.4,
    draw(t, g) {
      const P = 6
      const p = t % P
      const A = 1 - clamp01((p - 5.4) / 0.6)
      for (let x = 0; x < 19; x++) g.set(x, 13, 0.3 * A)
      const heights = [3, 5, 4, 7, 6, 9, 11]
      heights.forEach((h, i) => {
        const k = ease(clamp01((p - i * 0.35) / 1.1))
        const top = Math.round(h * k)
        const x = 1 + i * 2.6
        for (let y = 0; y < top; y++) {
          g.set(x, 12 - y, (y === top - 1 ? 0.95 : 0.55) * A)
          g.set(x + 1, 12 - y, (y === top - 1 ? 0.95 : 0.4) * A)
        }
      })
      // trend line
      const k = clamp01((p - 2.6) / 1.2)
      if (k > 0) g.line(1, 9, 17.5, 0.5, 0.35 * A, k)
    },
  },

  /* Signal arcs propagate from a source */
  signal: {
    w: 17,
    h: 13,
    rate: 18,
    still: 1.2,
    draw(t, g) {
      const cx = 8
      const cy = 11
      g.disc(cx, cy, 1, 0.95)
      for (let i = 0; i < 4; i++) {
        const r = 3 + i * 2.6
        const phase = (t * 1.6 - i * 0.55) % 2.2
        const a = phase > 0 && phase < 1 ? 1 - phase * 0.6 : 0.16
        for (let th = Math.PI * 1.2; th <= Math.PI * 1.8; th += 0.05) g.set(cx + Math.cos(th) * r, cy + Math.sin(th) * r, a * 0.9)
      }
    },
  },
}

/** Reads the current ink colour (follows light/dark theme). */
function useInk(tone: "ink" | "light") {
  const [ink, setInk] = React.useState(tone === "light" ? "255,255,255" : "17,17,17")
  React.useEffect(() => {
    if (tone === "light") return
    const read = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--ink-rgb").trim()
      if (v) setInk(v.split(/\s+/).join(","))
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => mo.disconnect()
  }, [tone])
  return ink
}

export function PixelAnim({
  scene,
  className,
  label,
  pitch = 4,
  tone = "ink",
}: {
  scene: PixelScene
  className?: string
  label?: string
  /** Size of one dot cell in CSS pixels. */
  pitch?: number
  tone?: "ink" | "light"
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const sc = SCENES[scene]
  const ink = useInk(tone)
  const cell = Math.max(1, Math.round(pitch * 0.75))

  React.useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
    const W = sc.w * pitch
    const H = sc.h * pitch
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const target = new Grid(sc.w, sc.h)
    const shown = new Float32Array(sc.w * sc.h)
    const paint = () => {
      ctx.clearRect(0, 0, W, H)
      for (let y = 0; y < sc.h; y++)
        for (let x = 0; x < sc.w; x++) {
          const a = shown[y * sc.w + x]
          if (a < 0.02) continue
          ctx.fillStyle = `rgba(${ink},${a.toFixed(3)})`
          ctx.fillRect(x * pitch, y * pitch, cell, cell)
        }
    }
    const frame = (time: number, dt: number) => {
      target.clear()
      sc.draw(time, target)
      const k = dt <= 0 ? 1 : 1 - Math.exp(-dt * (sc.rate ?? 14))
      for (let i = 0; i < shown.length; i++) shown[i] += (target.v[i] - shown[i]) * k
      paint()
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      frame(sc.still, 0)
      return
    }

    let raf = 0
    let last = 0
    let time = sc.still
    let visible = false
    const loop = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      time += dt
      frame(time, dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf || !visible || document.hidden) return
      last = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    frame(time, 0)
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [sc, ink, pitch, cell])

  return (
    <canvas
      ref={ref}
      data-scene={scene}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block select-none", className)}
      style={{ width: sc.w * pitch, height: sc.h * pitch }}
    />
  )
}
