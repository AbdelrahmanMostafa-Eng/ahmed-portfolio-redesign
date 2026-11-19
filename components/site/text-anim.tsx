"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** Renders "\n" in copy as line breaks. */
export function Lines({ text, breakClass }: { text: string; breakClass?: string }) {
  const lines = text.split("\n")
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && (
            <>
              {" "}
              <br className={breakClass} />
            </>
          )}
        </React.Fragment>
      ))}
    </>
  )
}

/** Hero headline — each word blurs in, flashes the brand gradient, then settles to ink. */
export function HeroTitle({ text, className, as: Tag = "h1" }: { text: string; className?: string; as?: "h1" | "h2" }) {
  const lines = text.split("\n")
  let i = 0
  return (
    <Tag className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <React.Fragment key={`${text}-${li}`}>
          {line
            .split(" ")
            .filter(Boolean)
            .map((word, wi, arr) => {
              const idx = i++
              return (
                <span
                  key={`${word}-${wi}`}
                  aria-hidden
                  className="hero-word py-[0.06em]"
                  style={{ animationDelay: `${idx * 0.09}s`, marginInlineEnd: wi < arr.length - 1 ? "0.24em" : 0 }}
                >
                  {word}
                </span>
              )
            })}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Tag>
  )
}

/** Section heading that reveals once scrolled into view. */
export function SectionTitle({ children, className, as: Tag = "h2" }: { children: React.ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  const ref = React.useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={cn("text-balance", className, visible ? "section-title-animate" : "opacity-0")}>
      {children}
    </Tag>
  )
}
