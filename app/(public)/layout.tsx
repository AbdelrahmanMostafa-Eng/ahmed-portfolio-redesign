import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { GradientBar } from "@/components/site/gradient-bar"
import { MagneticCursor } from "@/components/site/cursor"

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div id="top" />
      <MagneticCursor />
      <Header />
      <GradientBar />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
