import type { Metadata } from "next"
import { ContactPage } from "@/components/site/pages"
import { FaqSection } from "@/components/site/sections"
import { getMedia } from "@/lib/media"

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Ahmed Elkhateeb about software, web, AI education or IT systems — WhatsApp, email, phone or GitHub.",
}

export default function Contact() {
  const media = getMedia()
  return (
    <>
      <ContactPage portrait={media.portrait} />
      <FaqSection />
    </>
  )
}
