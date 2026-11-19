"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Tag } from "@/components/ui/tag"
import { PixelAnim, type PixelScene } from "./pixel-anim"
import { useLanguage } from "@/components/language-provider"
import { disciplines, disciplinesHead, disciplineFilters } from "@/lib/content"
import { cn } from "@/lib/utils"

const STICKY_TOP = 96
const STICKY_STEP = 16
const SCALE_STEP = 0.04
const OFFSET_STEP = 8

export const DISCIPLINE_SCENES: Record<string, PixelScene> = {
  software: "terminal",
  "ai-education": "neural",
  "digital-learning": "bars",
  "it-systems": "chip",
}

/** "Specimen plate" cover: hairline grid with a large dot-matrix scene. */
export function DisciplineCover({ id, className, pitch = 9 }: { id: string; className?: string; pitch?: number }) {
  return (
    <div className={cn("relative overflow-hidden bg-[#e9e7e1] dark:bg-[#1c1c1a]", className)}>
      <div className="bg-grid absolute inset-0" />
      <div className="absolute inset-0 grid place-items-center">
        <PixelAnim scene={DISCIPLINE_SCENES[id] ?? "network"} pitch={pitch} />
      </div>
    </div>
  )
}

/** Sticky stacking cards for the four disciplines. */
export function StackingDisciplines() {
  const { l } = useLanguage()
  const refs = React.useRef<(HTMLDivElement | null)[]>([])
  const [depth, setDepth] = React.useState<number[]>(disciplines.map(() => 0))

  React.useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      setDepth(
        disciplines.map((_, i) => {
          let n = 0
          for (let j = i + 1; j < disciplines.length; j++) {
            const el = refs.current[j]
            if (el && el.getBoundingClientRect().top <= STICKY_TOP + j * STICKY_STEP + 2) n++
          }
          return n
        }),
      )
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    measure()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className="flex flex-col">
      {disciplines.map((d, i) => {
        const k = depth[i] ?? 0
        const category = disciplineFilters.find((f) => f.id === d.category)
        return (
          <div
            key={d.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            className="sticky mb-4"
            style={{ top: STICKY_TOP + i * STICKY_STEP, zIndex: 10 + i }}
          >
            <div style={{ transform: `scale(${1 - k * SCALE_STEP}) translateY(${k * OFFSET_STEP}px)`, transformOrigin: "top center", transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
              <Link href={`/projects#${d.id}`} className="group relative block overflow-hidden rounded-2xl border border-border bg-plate">
                <div className="relative h-52 md:hidden">
                  <DisciplineCover id={d.id} pitch={7} className="absolute inset-0" />
                </div>
                <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/2 md:block">
                  <DisciplineCover id={d.id} className="absolute inset-0" />
                  <div className="absolute inset-y-0 start-0 w-1/4 bg-gradient-to-r from-plate to-transparent rtl:bg-gradient-to-l" />
                </div>
                <div className="relative z-10 p-7 md:p-10">
                  <div className="md:max-w-[52%]">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>
                        {l(disciplinesHead.label)} {String(i + 1).padStart(2, "0")}
                      </Tag>
                      {category && <Tag>{l(category.label)}</Tag>}
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-light tracking-tight md:text-3xl">{l(d.title)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l(d.summary)}</p>
                  </div>
                  <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-border pt-6 md:max-w-[52%]">
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {d.focus.map((f) => (
                        <li key={f.en}>{l(f)}</li>
                      ))}
                    </ul>
                    <span className="ms-auto inline-flex items-center gap-1 text-sm text-foreground/70 transition-colors group-hover:text-foreground">
                      {l(disciplinesHead.discuss)} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
