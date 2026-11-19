import type { Metadata } from "next"
import { DisciplinesPage } from "@/components/site/pages"
import { CtaBand, ProcessSection } from "@/components/site/sections"

export const metadata: Metadata = {
  title: "Disciplines",
  description: "Software and web solutions, AI education, digital learning, and IT systems and networking — the disciplines Ahmed Elkhateeb works in.",
}

export default function ProjectsPage() {
  return (
    <>
      <DisciplinesPage />
      <ProcessSection />
      <CtaBand />
    </>
  )
}
