"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RotateCcw } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLanguage()
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">{t("Unexpected error", "خطأ غير متوقع")}</p>
        <h1 className="mt-6 font-display text-4xl font-light tracking-tight md:text-6xl">{t("Something went wrong.", "حدث خطأ ما.")}</h1>
        <p className="mx-auto mt-5 max-w-sm text-muted-foreground">{t("Please try again in a moment.", "يُرجى المحاولة مرة أخرى بعد قليل.")}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-85">
            <RotateCcw className="size-4" /> {t("Try again", "إعادة المحاولة")}
          </button>
          <Link href="/" className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:border-foreground/25">
            {t("Back to home", "العودة للرئيسية")}
          </Link>
        </div>
      </div>
    </main>
  )
}
