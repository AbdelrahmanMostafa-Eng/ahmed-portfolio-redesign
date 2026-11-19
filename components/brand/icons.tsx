import { cn } from "@/lib/utils"

type IconProps = { className?: string }

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn("size-4", className)}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.5 9.5 0 0 1-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.05c0-5.24 4.27-9.5 9.51-9.5 2.54 0 4.92.99 6.72 2.79a9.43 9.43 0 0 1 2.78 6.72c0 5.24-4.27 9.5-9.51 9.5zm8.09-17.59A11.36 11.36 0 0 0 12.04.56C5.73.56.6 5.69.6 12a11.4 11.4 0 0 0 1.52 5.71L.5 23.5l5.93-1.56a11.4 11.4 0 0 0 5.6 1.43h.01c6.3 0 11.43-5.13 11.44-11.44 0-3.06-1.19-5.93-3.35-8.1z" />
    </svg>
  )
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn("size-4", className)}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
    </svg>
  )
}

/** Monogram mark: "ae" set in light display type inside a hairline square. */
export function Monogram({ className }: IconProps) {
  return (
    <span
      aria-hidden
      dir="ltr"
      className={cn(
        "relative grid size-8 place-items-center rounded-[0.55rem] bg-foreground font-display text-[0.95rem] font-normal tracking-[-0.04em] text-background",
        className,
      )}
    >
      ae
      <span className="absolute bottom-[7px] right-[6px] size-[3px] rounded-full bg-ember-400" />
    </span>
  )
}
