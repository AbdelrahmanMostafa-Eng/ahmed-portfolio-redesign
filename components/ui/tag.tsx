import { cn } from "@/lib/utils"

/** Small mono pill used above headings and on cards. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("tag", className)}>{children}</span>
}

/** Mono label + light numeral, used for stats and card metadata. */
export function Stat({ value, label, className }: { value: React.ReactNode; label: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="font-display text-2xl font-light tracking-tight">{value}</div>
      <div className="eyebrow mt-1 !text-[10.5px]">{label}</div>
    </div>
  )
}
