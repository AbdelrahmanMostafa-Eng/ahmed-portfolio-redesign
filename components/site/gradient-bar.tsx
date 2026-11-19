"use client"

import * as React from "react"

/** Thin flowing line under the header, shown while a [data-gradient-bar] section is on screen. */
export function GradientBar() {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      let on = false
      document.querySelectorAll("[data-gradient-bar]").forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.6 && r.bottom > 80) on = true
      })
      setVisible(on)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])
  return <div className="header-gradient-bar transition-opacity duration-500" style={{ opacity: visible ? 1 : 0 }} aria-hidden />
}
