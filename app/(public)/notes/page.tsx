import type { Metadata } from "next"
import { ProfilePage } from "@/components/site/pages"
import { CtaBand, FaqSection } from "@/components/site/sections"

export const metadata: Metadata = {
  title: "Profile",
  description: "Ahmed Elkhateeb’s credentials (CCNA, IT Essentials, ICDL), languages and working principles.",
}

export default function NotesPage() {
  return (
    <>
      <ProfilePage />
      <FaqSection />
      <CtaBand />
    </>
  )
}
