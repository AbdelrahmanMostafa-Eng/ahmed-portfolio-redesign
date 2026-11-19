"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { Bi } from "@/lib/content"

type Language = "en" | "ar"

type LanguageContextValue = {
  language: Language
  isAr: boolean
  ready: boolean
  setLanguage: (language: Language) => void
  /** Inline pair: t("Hello", "مرحبًا") */
  t: (en: string, ar: string) => string
  /** Content pair: l({ en, ar }) */
  l: (value: Bi) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  isAr: false,
  ready: false,
  setLanguage: () => {},
  t: (en) => en,
  l: (value) => value.en,
})

export const LANGUAGE_KEY = "ae-language"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>("en")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      updateLanguage(localStorage.getItem(LANGUAGE_KEY) === "ar" ? "ar" : "en")
    } catch {
      /* storage blocked */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = language
    root.dir = language === "ar" ? "rtl" : "ltr"
    if (ready) root.classList.remove("lang-pending")
  }, [language, ready])

  function setLanguage(value: Language) {
    updateLanguage(value)
    try {
      localStorage.setItem(LANGUAGE_KEY, value)
    } catch {
      /* storage blocked */
    }
  }

  const isAr = language === "ar"
  return (
    <LanguageContext.Provider
      value={{
        language,
        isAr,
        ready,
        setLanguage,
        t: (en, ar) => (isAr ? ar : en),
        l: (value) => (isAr ? value.ar : value.en),
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

/** EN / العربية pill switch. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  return (
    <div role="group" aria-label="Language / اللغة" className={cn("inline-flex items-center rounded-full border border-border p-0.5 text-xs", className)}>
      {(
        [
          ["en", "EN"],
          ["ar", "عربي"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          lang={value}
          aria-pressed={language === value}
          onClick={() => setLanguage(value)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            language === value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            value === "en" && "font-mono text-[10.5px] tracking-[0.12em]",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
