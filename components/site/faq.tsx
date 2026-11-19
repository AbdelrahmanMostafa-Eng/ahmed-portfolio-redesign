"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { Plus } from "lucide-react"

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-border" defaultValue="0">
      {items.map((f, i) => (
        <Accordion.Item key={i} value={String(i)} className="border-b border-border">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-start text-[1.05rem] font-normal">
              <span className="flex gap-4">
                <span className="mt-1 font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                {f.q}
              </span>
              <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-45" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden text-sm leading-relaxed text-muted-foreground data-[state=closed]:animate-[acc-up_200ms_ease] data-[state=open]:animate-[acc-down_250ms_ease]">
            <p className="pb-6 pe-10 ps-9">{f.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
